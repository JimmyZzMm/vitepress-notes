# [CSRF](https://juejin.cn/post/6844903689702866952?searchId=2024021610122912D81398EC17CA16D28D#heading-18)

![CSRF](https://raw.githubusercontent.com/JimmyZzMm/article-pictures/main/typora/CSRF.png)

## 定义

### CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

## 实现流程

### 受害者登录a.com，并保留了登录凭证（Cookie）。

### 攻击者引诱受害者访问了b.com。

### b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会…

### a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。

### a.com以受害者的名义执行了act=xx。

### 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作。

## 攻击类型

### GET类型的CSRF

- GET类型的CSRF利用非常简单，只需要一个HTTP请求，一般会这样利用：

- 复制代码 <img src="http://bank.example/withdraw?amount=10000&for=hacker" > 

- 在受害者访问含有这个img的页面后，浏览器会自动向http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker发出一次HTTP请求。bank.example就会收到包含受害者登录信息的一次跨域请求。

### POST类型的CSRF

- 这种类型的CSRF利用起来通常使用的是一个自动提交的表单，如：

- 访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作。

- POST类型的攻击通常比GET要求更加严格一点，但仍并不复杂。任何个人网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能将安全寄托在仅允许POST上面。

### 链接类型的CSRF

- 链接类型的CSRF并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击

## 防护策略

### 阻止不明外域的访问

- 同源检测

	- Origin Header

	- Referer Header

- Samesite Cookie

	- Samesite=Strict

		- 我们在 a.com 下发起对 b.com 的任意请求，Cookie都不会被包含在 Cookie 请求头中。举个实际的例子就是，假如淘宝网站用来识别用户登录与否的 Cookie 被设置成了 Samesite=Strict，那么用户从百度搜索页面甚至天猫页面的链接点击进入淘宝后，淘宝都不会是登录状态，因为淘宝的服务器不会接受到那个 Cookie，其它网站发起的对淘宝的任意请求都不会带上那个 Cookie。

	- Samesite=Lax

		- 这种称为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个GET请求，则这个Cookie可以作为第三方Cookie。比如说 b.com设置了如下Cookie

### 提交时要求附加本域才能获取的信息

- CSRF Token

	- CSRF攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个CSRF攻击者无法获取到的Token。服务器通过校验请求是否携带正确的Token，来把正常的请求和攻击的请求区分开，也可以防范CSRF的攻击。

	- 实现步骤

		- 1.将CSRF Token输出到页面中

		- 2.页面提交的请求携带这个Token

		- 3.服务器验证Token是否正确

- 双重Cookie验证

	- 在会话中存储CSRF Token比较繁琐，而且不能在通用的拦截上统一处理所有的接口。那么另一种防御措施是使用双重提交Cookie。利用CSRF攻击不能获取到用户Cookie的特点，我们可以要求Ajax和表单请求携带一个Cookie中的值。

	- 实现步骤

		- 在用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串（例如csrfcookie=v8g9e4ksfhw）。

		- 在前端向后端发起请求时，取出Cookie，并添加到URL的参数中（接上例POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw）。

		- 后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝。

### 双重验证

- 手机验证码

- 滑块验证码

