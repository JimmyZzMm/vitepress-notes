# 说说webpack中常见的Plugin？解决了什么问题？

## 是什么

`plugin`赋予`webpack`各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期

![img](https://static.vue-js.com/9a04ec40-a7c2-11eb-ab90-d9ae814b240d.png)

目的在于解决`loader` 无法实现的其他事

##  配置方式

一般情况，通过配置文件导出对象中`plugins`属性传入`new`实例对象。如下所示：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {
  ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};
```

## 常见的Plugin

```js
{
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].chunk.[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(rootPath, 'src/index.html'),
        }),
        new webpack.DefinePlugin({
            'process.env.IS_OFFLINE': JSON.stringify(true),
        }),
        !isLocal &&
            dest &&
            customConfig.pushTarget[dest] &&
            new WebpackUploadPlugin({
                host: customConfig.pushTarget[dest].host,
                to: customConfig.pushTarget[dest].odpDir,
                test() {
                    return true;
                },
            }),
        new CopyPlugin({
            patterns: [{ from: 'src/third_party', to: 'page/third_party' }],
        }),
        // 添加 npm run prod -- --env analyse参数分析结果
        analyse &&
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
            }),
        new WeirwoodWebpackPlugin({
            // token 可在 weirwood 平台的项目管理中查看
            token: '51622a0d9b2342d5a3d5ac8f92dff5f2',
        }),
    ]
}
```

![img](https://static.vue-js.com/bd749400-a7c2-11eb-85f6-6fac77c0c9b3.png)

## 如何实现

```js
class FileSizeReporterPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileSizeReporterPlugin', (compilation, callback) => {
      let str = ''
      for (let filename in compilation.assets){
        str += `文件:${filename}  大小${compilation.assets[filename]['size']()}\n`
      }
      // 通过compilation.assets可以获取打包后静态资源信息，同样也可以写入资源
      compilation.assets['fileSize.md'] = {
        source:function(){
          return str
        },
        size:function(){
          return str.length
        }
      }
      callback()
    })
  }
}

module.exports = FileSizeReporterPlugin;
```

## **compiler和 compilation的区别**

- compiler代表了整个webpack从启动到关闭的生命周期，而compilation 只是代表了一次新的编译过程
- `compiler` 对象包含了`Webpack` 环境所有的的配置信息。这个对象在启动 `webpack` 时被一次性建立，并配置好所有可操作的设置，包括 `options`，`loader` 和 `plugin`。当在 `webpack` 环境中应用一个插件时，插件将收到此 `compiler` 对象的引用。可以使用它来访问 `webpack` 的主环境。（比如是用compiler.hooks设置不同的声明周期钩子函数）
- `compilation`对象包含了当前编译的模块资源、编译生成资源、变化的文件等。当运行`webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的编译资源。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

## loader和plugin区别

前面两节我们有提到`Loader`与`Plugin`对应的概念，先来回顾下

- loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中
- plugin 赋予了 webpack 各种灵活的功能，可以在不同的声明周期钩子执行不同的任务，例如打包优化、资源管理、环境变量注入等，目的是解决 loader 无法实现的其他事