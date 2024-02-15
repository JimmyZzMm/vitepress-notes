import { defineConfig } from "vitepress";
import { set_sidebar } from "./set_sidebar.mjs";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  title: "jimmy's blog",
  description: "A VitePress Site",
  head: [["link", { rel: "shortcut icon", href: "/logo.png" }]],
  themeConfig: {
    search: {
      provider: "local",
    },
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],

    sidebar: set_sidebar(""),

    socialLinks: [{ icon: "github", link: "https://github.com/JimmyZzMm" }],
  },
});
