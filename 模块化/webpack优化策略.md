# 说说如何借助webpack来优化前端性能？

## 如何优化

通过`webpack`优化前端的手段有：

- JS代码压缩：terser-webpack-plugin，webpack已经自动集成，会压缩函数和变量名，删除无用的空格

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    ...
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true // 电脑cpu核数-1
            })
        ]
    }
}
```

- CSS代码压缩：css-minimizer-webpack-plugin，`CSS`压缩通常是去除无用的空格等

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
    // ...
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true
            })
        ]
    }
}
```

- Html文件代码压缩：使用`HtmlWebpackPlugin`插件来生成`HTML`的模板时候，通过配置属性`minify`进行`html`优化

  ```js
  module.exports = {
      ...
      plugin:[
          new HtmlwebpackPlugin({
              ...
              minify:{
                  minifyCSS:false, // 是否压缩css
                  collapseWhitespace:false, // 是否折叠空格
                  removeComments:true // 是否移除注释
              }
          })
      ]
  }
  ```

- 文件大小压缩：使用gzip压缩算法（一般不使用，nginx可以配置）

```js
new ComepressionPlugin({
    test:/\.(css|js)$/,  // 哪些文件需要压缩
    threshold:500, // 设置文件多大开始压缩
    minRatio:0.7, // 至少压缩的比例
    algorithm:"gzip", // 采用的压缩算法
})
```

- 图片压缩：一般使用`image-webpack-loader`，可以压缩图片，将图片转换为webp格式

```js
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            // 压缩 jpeg 的配置
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
            optipng: {
              enabled: false,
            },
            // 使用 imagemin-pngquant 压缩 png
            pngquant: {
              quality: '65-90',
              speed: 4
            },
            // 压缩 gif 的配置
            gifsicle: {
              interlaced: false,
            },
            // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
            webp: {
              quality: 75
            }
          }
        }
      ]
    },
  ]
} 
```

- Tree Shaking：`Tree Shaking` 是一个术语，在计算机中表示消除deadcode，依赖于`ES Module`的静态语法分析（不执行任何的代码，可以明确知道模块的依赖关系），同时消除了return后面的语句等，配置时可以配置sideEffects指明哪些文件有副作用，使得打包工具可以更加精确地进行 Tree Shaking。

- 代码分割：这里通过`splitChunksPlugin`来实现，该插件`webpack`已经默认安装和集成，只需要配置即可

  默认配置中，chunks仅仅针对于异步（async）请求，我们可以设置为initial或者all

  ```js
  module.exports = {
      ...
      optimization:{
          splitChunks:{
              chunks:"all"
          }
      }
  }
  ```

- 内联 chunk：使用url-loader（assets/inline）来设置小于10kb的文件转换为base64编码，减少网络请求