# react-router

## **什么是单页面应用？**

单页应用（Single Page Application, SPA）是一种网页应用程序的开发模式，它通过动态重写当前页面来与用户交互，而不是传统的从服务器加载整个新页面。

### 优势

- 用户体验更好，因为页面不需要重新加载
- 前后端分离，有助于提升开发效率和降低维护成本
- 减少服务端压力

### 劣势

- seo不友好
- 首屏渲染慢
- 浏览器性能要求高

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a08f0155b494fd7bb3bdcb12104c060~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## react-router-dom和react-router和history库三者什么关系

1. **react-router**: 这是React路由库的核心，它提供了在React应用中管理路由的基本机制。它定义了一套基础的API和组件，如`Router`、`Route`、`Switch`等，这些组件和API用于声明式地定义路由、处理路由变化以及渲染对应的UI组件。`react-router`是平台无关的，这意味着它不仅可以用在Web应用中，也可以用在React Native等其他React项目中。
2. **react-router-dom**: 这个库建立在`react-router`之上，专门服务于Web应用。它提供了一些只在DOM中使用的组件和API，如`BrowserRouter`、`Link`、`NavLink`等。这些组件利用了浏览器的历史API来创建路由和处理导航。简而言之，`react-router-dom`是针对Web应用的`react-router`的封装，提供了更多与DOM操作相关的功能。
3. **history**: 这是一个独立的库，用于封装JavaScript中的历史API（`window.history`）。`react-router`和`react-router-dom`库内部使用`history`库来管理路由的历史记录、监听浏览器地址的变化以及控制导航等。

### 关系总结

- `react-router`提供了构建SPA路由系统的基础设施和核心API。
- `react-router-dom`基于`react-router`，专门为Web环境增加了更多与DOM操作相关的组件和API。
- `history`库是`react-router`和`react-router-dom`使用的底层库，负责与浏览器历史记录的交互。

## 单页面实现核心原理

单页面应用路由实现原理是，切换url，监听url变化，从而渲染不同的页面组件。

主要的方式有`history`模式和`hash`模式。

### 1 history模式原理

#### ①改变路由

```
history.pushState(state,title,path)
```

1 `**state**`：一个与指定网址相关的状态对象， popstate 事件触发时，该对象会传入回调函数。如果不需要可填 null。

2 `**title**`：新页面的标题，但是所有浏览器目前都忽略这个值，可填 null。

3 `**path**`：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个地址。

```
history.replaceState(state,title,path)
```

参数和`pushState`一样，这个方法会修改当前的` history `对象记录， `history.length` 的长度不会改变。



**`history.pushState` `history.replaceState`可以使浏览器地址改变，但是无需刷新页面。**

#### ②监听路由

```
window.addEventListener('popstate',function(e){
    /* 监听改变 */
})
```

同一个文档的 `history` 对象出现变化时，就会触发` popstate` 事件 `history.pushState` 可以使浏览器地址改变，但是无需刷新页面。**注意⚠️的是：用 `history.pushState()` 或者 `history.replaceState()` 不会触发 `popstate` 事件**。 `popstate` 事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮或者调用 `history.back()、history.forward()、history.go()`方法。

### 2 hash模式原理

实际上hash就是锚点，改变也不会有浏览器的默认行为

#### ①改变路由

通过`window.location.hash ` 属性获取和设置 `hash `值。

#### ②监听路由

```js
window.addEventListener('hashchange',function(e){
    /* 监听改变 */
})
```

## **`history`库整体工作流程。**

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac7ed7a701714650b55c9193db2220ea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

1. history主要负责利用setState派发更新。
2. 通过popstate和hashchange监听用户行为，例如路径的改变，后退和前进按钮的点击等。
3. 开发者通过push或者replace方法，触发更新，并使用pushstate和window.location.hash，

## 核心api

### 1 Router-接收location变化，派发更新流

### 2 Switch-匹配正确的唯一的路由

### 3 Route-组件页面承载容器

### 4 Redirect-没有符合的路由，那么重定向

## 流程分析

**当地址栏改变url，组件的更新渲染都经历了什么？**

拿history模式做参考。当url改变，首先触发histoy，调用事件监听`popstate`事件， 触发回调函数`handlePopState`，触发history下面的`setstate`方法，产生新的location对象，然后通知Router组件更新`location`并通过``context上下文传递，`switch`通过传递的更新流，匹配出符合的Route组件渲染，最后有`Route`组件取出`context`内容，传递给渲染页面，渲染更新。

**当我们调用`history.push`方法，切换路由，组件的更新渲染又都经历了什么呢？**

我们还是拿history模式作为参考，当我们调用`history.push`方法，首先调用history的`push`方法，通过`history.pushState`来改变当前`url`，接下来触发history下面的`setState`方法，接下来的步骤就和上面一模一样了，这里就不一一说了。

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5de251f8dc649e3ae1b1fcf382330ee~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)