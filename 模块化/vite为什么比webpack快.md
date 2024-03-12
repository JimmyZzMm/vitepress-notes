# vite为什么比webpack快？

- vite使用的是基于es6 module的冷启动方式，使用按需加载，只打包需要的部分
- vite使用esbuild进行构建，esbuild基于go开发，有多线程能力，性能更好
- vite hmr只用进行单文件替换，不像webpack需要分析全部依赖关系图
- vite内置了很多功能，相比webpack上手更快