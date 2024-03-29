# http1

- 短连接，每发送一次请求就要从新建立一次tcp连接
- 不支持管道网络传输，请求发出后，需要等待响应，才能再次发送



# http1.1

### 优点

- 长连接，多次请求可以复用一个tcp长连接（由响应头里面的Connection字段控制，默认值为keep-alive，默认开启，关闭需要设置该值为close）
- 支持管道（pipeline）网络传输，第一个请求发出后，不要等待响应，就可以继续发送请求

### 缺点

- 虽然没有请求端的队头阻塞，但是有响应端的，响应必须按顺序返回，如果前面的请求服务器响应慢，依旧会阻塞后面的请求。
- 冗余的头部信息，头部有很多重复的信息，且无法压缩（虽然body部分内容可以使用gzip等算法压缩）
- 没有请求优先级控制
- 请求只能由客户端发起



## http2

### 优点：

- 头部压缩：**HPACK** 算法，使用静态字典维护高频使用的常用的头部信息（例如响应状态码），使用动态字典动态的添加其他用户相关的信息（例如user-agent），最后使用Huffman编码压缩算法，进一步压缩头部信息。HPACK 算法主要包含三个组成部分：
  - 静态字典；
  - 动态字典；
  - Huffman 编码（压缩算法）；
- 使用二进制，增加了数据传输效率（比如状态码 200 ，在 HTTP/1.1 是用 '2''0''0' 三个字符来表示（二进制：00110010 00110000 00110000），共用了 3 个字节，在 HTTP/2 对于状态码 200 的二进制编码是 10001000，只用了 1 字节就能表示，相比于 HTTP/1.1 节省了 2 个字节）
- *并发传输*：增加流标识符，相比于http1.1建立多个tcp连接实现并发请求，http2在一条tcp连接上就可以实现并发请求，并且流标识符还可以标记优先级，让客户端优先处理某些响应。
- 服务器主动推送资源：服务端不再是被动地响应，可以**主动**向客户端发送消息。客户端和服务器**双方都可以建立 Stream**， Stream ID 也是有区别的，客户端建立的 Stream 必须是奇数号，而服务器建立的 Stream 必须是偶数号

### 缺点

虽然在http层全面解决了利用流的并发，解决了http1.1响应队头阻塞的问题，但是在tcp层，由于tcp是面向字节流的协议，一个消息可能会被拆分成多个报文，当某一个字节的数据发生丢失时，由于传输层无法将消息组合完整，会把数据暂存在缓冲区，等待丢失的数据接收到之后才会组装成完整的消息，交给应用层，也就是http。**一旦发生丢包，就会阻塞住所有的 HTTP 请求**，这属于 TCP 层队头阻塞

所以，http2仍然存在队头阻塞问题，不过问题出在它依赖的传输层协议tcp



# http3

### **QUIC 协议**

为了解决http2中tcp层存在的队头阻塞问题，http3使用了基于udp的QUIC协议，QUIC主要有以下三个特点

- 无队头阻塞：QUIC 协议也有类似 HTTP/2 Stream 与多路复用的概念，也是可以在同一条连接上并发传输多个 Stream，Stream 可以认为就是一条 HTTP 请求。

  QUIC 有自己的一套机制可以保证传输的可靠性的。**当某个流发生丢包时，只会阻塞这个流，其他流不会受到影响，因此不存在队头阻塞问题**。这与 HTTP/2 不同，HTTP/2 只要某个流中的数据包丢失了，其他流也会因此受影响。

  所以，QUIC 连接上的多个 Stream 之间并没有依赖，都是独立的，某个流发生丢包了，只会影响该流，其他流不受影响。

- *更快的连接建立*：之前由于tcp和tls是分层的，分别属于内核实现的传输层、openssl 库实现的表示层，因此它们难以合并在一起，需要分批次来握手，先 TCP 握手，再 TLS 握手。HTTP/3 在传输数据前虽然需要 QUIC 协议握手，但是这个握手过程只需要 1 RTT，握手的目的是为确认双方的「连接 ID」，连接迁移就是基于连接 ID 实现的。

  但是 HTTP/3 的 QUIC 协议并不是与 TLS 分层，而是 QUIC 内部包含了 TLS，它在自己的帧会携带 TLS 里的“记录”，再加上 QUIC 使用的是 TLS/1.3，因此仅需 1 个 RTT 就可以「同时」完成建立连接与密钥协商，如下图：

  ![TCP HTTPS（TLS/1.3） 和 QUIC HTTPS ](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/28-HTTP3%E4%BA%A4%E4%BA%92%E6%AC%A1%E6%95%B0.png)

- *连接迁移*：基于 TCP 传输协议的 HTTP 协议，由于是通过四元组（源 IP、源端口、目的 IP、目的端口）确定一条 TCP 连接。![TCP 四元组](https://cdn.xiaolincoding.com//mysql/other/format,png-20230309231026577.png)

那么**当移动设备的网络从 4G 切换到 WIFI 时，意味着 IP 地址变化了，那么就必须要断开连接，然后重新建立连接**。而建立连接的过程包含 TCP 三次握手和 TLS 四次握手的时延，以及 TCP 慢启动的减速过程，给用户的感觉就是网络突然卡顿了一下，因此连接的迁移成本是很高的。

而 QUIC 协议没有用四元组的方式来“绑定”连接，而是通过**连接 ID** 来标记通信的两个端点，客户端和服务器可以各自选择一组 ID 来标记自己，因此即使移动设备的网络变化后，导致 IP 地址变化了，只要仍保有上下文信息（比如连接 ID、TLS 密钥等），就可以“无缝”地复用原连接，消除重连的成本，没有丝毫卡顿感，达到了**连接迁移**的功能。

### 结论

所以， QUIC 是一个在 UDP 之上的**伪** TCP + TLS + HTTP/2 的多路复用的协议。

QUIC 是新协议，存在很多兼容性的问题，对于很多网络设备，根本不知道什么是 QUIC，只会当做 UDP，这样会出现新的问题，因为有的网络设备是会丢掉 UDP 包的，而 QUIC 是基于 UDP 实现的，那么如果网络设备无法识别这个是 QUIC 包，那么就会当作 UDP包，然后被丢弃。

HTTP/3 现在普及的进度非常的缓慢，不知道未来 UDP 是否能够逆袭 TCP。