import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "jimmy blog",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "学习资料", link: "/internet/url.md" },
    ],

    sidebar: [
      {
        text: "计算机网络",
        items: [
          { text: "HTTP缓存技术", link: "/internet/HTTP-cache.md" },
          { text: "浏览器输入url会发生什么", link: "/internet/url.md" },
          { text: "http1 1.1 2 3区别", link: "/internet/http-version.md" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/JimmyZzMm" }],
  },
});
