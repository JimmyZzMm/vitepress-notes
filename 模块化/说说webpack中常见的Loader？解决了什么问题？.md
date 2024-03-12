# 说说webpack中常见的Loader？解决了什么问题？如何实现一个loader？

## 是什么

`loader` 用于对模块的"源代码"进行转换，在 `import` 或"加载"模块时预处理文件

`webpack`做的事情，仅仅是分析出各种模块的依赖关系，然后形成资源列表，最终打包生成到指定的文件中。如下图所示：

![img](https://static.vue-js.com/7b8d9640-a6ff-11eb-ab90-d9ae814b240d.png)

在`webpack`内部中，任何文件都是模块，不仅仅只是`js`文件

默认情况下，在遇到`import`或者`require`加载模块的时候，`webpack`只支持对`js` 和 `json` 文件打包

像`css`、`sass`、`png`等这些类型的文件的时候，`webpack`则无能为力，这时候就需要配置对应的`loader`进行文件内容的解析

在加载模块的时候，执行顺序如下：

![img](https://static.vue-js.com/9c2c43b0-a6ff-11eb-85f6-6fac77c0c9b3.png)

当 `webpack` 碰到不识别的模块的时候，`webpack` 会在配置的中查找该文件解析规则

### 配置方式

关于`loader`的配置，我们是写在`module.rules`属性中，属性介绍如下：

- `rules`是一个数组的形式，因此我们可以配置很多个`loader`
- 每一个`loader`对应一个对象的形式，对象属性`test` 为匹配的规则，一般情况为正则表达式
- 属性`use`针对匹配到文件类型，调用对应的 `loader` 进行处理

代码编写，如下形式：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```

## 常见的loader

- style-loader: 将css添加到DOM的内联样式标签style里
- css-loader :允许将css文件通过require的方式引入，并返回css代码
- less-loader: 处理less
- sass-loader: 处理sass

- postcss-loader: 用postcss来处理CSS

- babel-loader :用babel来转换ES6文件到ES
- swc-loader:编辑js和ts文件
- **`file-loader`**: 处理项目中的文件，可以将文件在处理后的结果中输出到指定目录，并返回最终的URL。在Webpack 5中，建议使用资源模块(`asset/resource`)来代替`file-loader`。
- **`url-loader`**: 功能类似于`file-loader`，但是当文件大小低于指定的限制时，可以返回一个DataURL。在Webpack 5中，建议使用资源模块(`asset/inline`)来代替`url-loader`。

- html-minify-loader: 压缩HTML
- MiniCssExtractPlugin.loader：压缩css

## 如何实现一个loader

- 同步：直接return想要输出的内容
- 异步：调用this.async()返回的函数，第一个参数是error，第二是result
- this：loader函数的this会指向当前loader的上下文

```js
const fs = require('fs');

module.exports = function(source) {
  // 调用this.async()获取回调函数
  const callback = this.async();
  const options = this.getOptions();

  // 假设我们异步读取一个配置文件
  fs.readFile('path/to/config.json', 'utf-8', (err, data) => {
    if (err) {
      // 如果出错，通过回调函数返回错误
      return callback(err);
    }
    // 处理数据（这里仅作示例，实际可能需要根据读取的数据进行更复杂的处理）
    const result = someTransformationFunction(source, data);
    // 异步操作成功完成，返回处理后的结果
    callback(null, result);
  });
};

function someTransformationFunction(source, data) {
  // 对源内容和读取的数据进行某种形式的处理
  // 这里的处理逻辑取决于你的具体需求
  return `/* Config Data: ${data} */\n${source}`;
}

```



### Loader上下文对象提供的一些关键功能包括：

- **访问loader的选项**：通过`this.getOptions()`方法，可以获取到传递给当前loader的选项。
- **启用缓存**：通过调用`this.cacheable()`方法，可以将当前loader的结果标记为可缓存的，这有助于提高构建性能。
- **添加依赖**：通过`this.addDependency(file)`方法，可以向当前正在处理的模块添加一个文件依赖，这意味着如果该文件发生变化，模块会重新构建。
- **处理异步操作**：通过`this.async()`方法，可以获取一个回调函数用于异步操作。这允许loader执行异步任务，如读取文件或查询数据库。
- **发出警告和错误**：通过`this.emitWarning(warning)`和`this.emitError(error)`方法，可以在构建过程中向用户报告警告和错误。