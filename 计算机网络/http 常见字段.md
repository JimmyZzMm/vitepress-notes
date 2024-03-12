# http 常见字段![http 常见字段](https://raw.githubusercontent.com/JimmyZzMm/article-pictures/main/typora/http 常见字段.png)

## 请求

### Connection: keep-alive

- Connection 字段最常用于客户端要求服务器使用 TCP 持久连接，以便其他请求复用。

- HTTP/1.1 版本的默认连接都是持久连接，但为了兼容老版本的 HTTP，需要指定 Connection 首部字段的值为 Keep-Alive。

### Host: www.A.com

- 客户端发送请求时，用来指定服务器的域名。

### Accept-Encoding: gzip, deflate

- 客户端在请求时，用 Accept-Encoding 字段说明自己可以接受哪些压缩方法。

### Accept: */*

- 客户端请求的时候，可以使用 Accept 字段声明自己可以接受哪些数据格式。

### Referer

- 请求来源

### origin

- 请求来源

### User-Agent

- 它允许客户端（通常是Web浏览器或爬虫）向服务器传递关于自己的信息。这些信息通常包括客户端的类型、版本、操作系统、语言等。服务器可以使用这些信息来决定如何响应请求，例如，提供特定于浏览器的内容或优化的数据格式。

### If-Modified-Since

- 当资源过期了，发现响应头中具有 Last-Modified 声明，则再次发起请求的时候带上 Last-Modified 的时间，服务器收到请求后发现有 If-Modified-Since 则与被请求资源的最后修改时间进行对比（Last-Modified），如果最后修改时间较新（大），说明资源又被改过，则返回最新资源，HTTP 200 OK；如果最后修改时间较旧（小），说明资源无新修改，响应 HTTP 304 走缓存。

### If-None-Match

- 当资源过期时，浏览器发现响应头里有 Etag，则再次向服务器发起请求时，会将请求头 If-None-Match 值设置为 Etag 的值。服务器收到请求后进行比对，如果资源没有变化返回 304，如果资源变化了返回 200。

## 响应

### Content-Type: text/html; charset=utf-8

- Content-Type 字段用于服务器回应时，告诉客户端，本次数据是什么格式。

### Content-Encoding: gzip

- Content-Encoding 字段说明数据的压缩方法。表示服务器返回的数据使用了什么压缩格式

### Cache-Control

- 强制缓存相对时间

	- 如果 HTTP 响应头部同时有 Cache-Control 和 Expires 字段的话，Cache-Control 的优先级高于 Expires 。

### Expires

- 强制缓存绝对时间

### Last-Modified

- 标示这个响应资源的最后修改时间

### Etag

- 唯一标识响应资源

	- 如果在第一次请求资源的时候，服务端返回的 HTTP 响应头部同时有 Etag 和 Last-Modified 字段，那么客户端再下一次请求的时候，如果带上了 ETag 和 Last-Modified 字段信息给服务端，这时 Etag 的优先级更高，也就是服务端先会判断 Etag 是否变化了，如果 Etag 有变化就不用在判断 Last-Modified 了，如果 Etag 没有变化，然后再看 Last-Modified。

	- 为什么 ETag 的优先级更高？

		- 在没有修改文件内容情况下文件的最后修改时间可能也会改变，这会导致客户端认为这文件被改动了，从而重新请求；

		- 可能有些文件是在秒级以内修改的，If-Modified-Since 能检查到的粒度是秒级的，使用 Etag就能够保证这种需求下客户端在 1 秒内能刷新多次；

		- 有些服务器不能精确获取文件的最后修改时间。

