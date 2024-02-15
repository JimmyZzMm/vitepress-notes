# Options请求

![67cf1327ec8649ab94342441cf4295e4~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0](https://raw.githubusercontent.com/JimmyZzMm/article-pictures/main/typora/67cf1327ec8649ab94342441cf4295e4%7Etplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)

## options触发条件

跨域且请求时非简单请求（不满足简单请求条件）

1. 发送跨域请求时，请求头中包含了一些非简单请求的头信息，例如自定义头（custom header）等；
2. 发送跨域请求时，使用了 PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH等请求方法。



### 简单请求

简单请求要满足两个条件：

1. 请求方法为：`HEAD`、`GET`、`POST`

2. ```
   header
   ```

   中只能包含以下请求头字段：

   - `Accept`

   - `Accept-Language`

   - `Content-Language`

   - ```
     Content-Type
     ```

     : 所指的媒体类型值仅仅限于下列三者之一

     - `text/plain`
     - `multipart/form-data`
     - `application/x-www-form-urlencoded`



## 为什么有options请求

发出非简单`cors`请求，浏览器会做一个`http`的查询请求（预检请求）也就是`options`。`options`请求会按照简单请求来处理。那么为什么会做一次`options`请求呢？

检查服务器是否支持跨域请求，并且确认实际请求的**安全性**。预检请求的目的是为了保护客户端的安全，防止不受信任的网站利用用户的浏览器向其他网站发送恶意请求。 预检请求头中除了携带了`origin`字段还包含了两个特殊字段：

- `Access-Control-Request-Method`： 告知服务器实际请求使用的`HTTP`方法
- `Access-Control-Request-Headers`：告知服务器实际请求所携带的自定义首部字段。 比如：



## 如何去掉或者减少option请求

由于预检请求（options请求）的存在是为了保护客户端的安全，防止不受信任的网站利用用户的浏览器向其他网站发送恶意请求，因此不能完全去掉options请求。但是可以通过以下方式来减少options请求的次数：

1. 确保请求头部信息不超出简单请求所规定的字段范围；
2. 如果Content-Type的值不属于以下几种：application/x-www-form-urlencoded、multipart/form-data、text/plain，则改为使用其中一种；
3. 将请求方法改为GET或POST中的一种；
4. 使用跨域资源共享（CORS）中的其他方式（如设置Access-Control-Max-Age）来缓存预检请求的结果，减少options请求的次数。