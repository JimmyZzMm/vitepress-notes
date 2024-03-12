# 说说webpack的热更新是如何做到的？原理是什么？

## 是什么

`HMR`全称 `Hot Module Replacement`，可以理解为模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

例如，我们在应用运行过程中修改了某个模块，通过自动刷新会导致整个应用的整体刷新，那页面中的状态信息都会丢失

如果使用的是 `HMR`，就可以实现只将修改的模块实时替换至应用中，不必完全刷新整个应用

在`webpack`中配置开启热模块也非常的简单，如下代码：

```js
const webpack = require('webpack')
module.exports = {
  // ...
  devServer: {
    // 开启 HMR 特性
    hot: true
    // hotOnly: true
  }
}
```

## 实现原理

![img](https://static.vue-js.com/adc05780-acd4-11eb-ab90-d9ae814b240d.png)

- 启动阶段为上图 1 - 2 - A - B：在编写未经过`webpack`打包的源代码后，`Webpack Compile` 将源代码和 `HMR Runtime` 一起编译成 `bundle`文件，传输给`Bundle Server` 静态资源服务器
- 更新阶段为上图 1 - 2 - 3 - 4：首先webpack监听到文件变化，对文件重新进行依赖分析，生成补丁文件和唯一hash值，然后通过ws连接将变化的部分传输给浏览器端，浏览器端根据hash值发起ajax请求，获取变化的补丁文件，最终重新render完成更新。

**每一部分的功能：**

- Webpack Compile：将 JS 源代码编译成 bundle.js
- HMR Server：用来将热更新的文件输出给 HMR Runtime
- Bundle Server：静态资源文件服务器，提供文件访问路径
- HMR Runtime：处理websocket连接和根据hash值改变重新获取文件并进行局部render的逻辑代码，会被注入到浏览器，更新文件的变化
- bundle.js：构建输出的文件
- 在HMR Runtime 和 HMR Server之间建立 websocket，即图上4号线，用于实时更新文件变化