---
title: "从零搭建 Astro 个人博客并部署到 GitHub Pages"
titleEn: "Build an Astro blog from scratch and deploy it to GitHub Pages"
description: "一步步教你用 Astro 搭建个人博客，配置 GitHub Actions 自动部署到 GitHub Pages，完全免费。"
descriptionEn: "A step-by-step guide to building a personal Astro blog and deploying it to GitHub Pages for free."
pubDate: 2026-03-18
tags: ["教程", "Astro", "GitHub Pages"]
tagsEn: ["Tutorial", "Astro", "GitHub Pages"]
---

本文记录我从零搭建这个博客的完整过程。使用 **Astro** 作为静态站点框架，**GitHub Pages** 免费托管，**GitHub Actions** 自动部署。

## 为什么选 Astro？

| 特性 | 说明 |
|------|------|
| 极快 | 默认零 JS，页面加载飞快 |
| Markdown | 原生支持 Markdown/MDX 写作 |
| 灵活 | 可混用 React、Vue、Svelte 组件 |
| 部署简单 | 静态输出，适配各种免费托管平台 |

## 前置准备

开始之前，确保你的电脑上安装了以下工具：

- **Node.js**（v18 或更高版本）— 去 [nodejs.org](https://nodejs.org/) 下载
- **Git** — 去 [git-scm.com](https://git-scm.com/) 下载
- **一个 GitHub 账号** — 去 [github.com](https://github.com/) 注册

在终端中验证安装：

```bash
node --version   # 应显示 v18.x.x 或更高
npm --version    # 应显示 9.x.x 或更高
git --version    # 应显示 git version 2.x.x
```

## 第一步：创建项目

打开终端，运行以下命令：

```bash
# 使用 Astro 官方脚手架创建博客项目
npm create astro@latest -- my-blog --template blog

# 进入项目目录
cd my-blog

# 安装依赖
npm install
```

如果网络有问题导致模板下载失败，也可以手动创建项目：

```bash
mkdir my-blog && cd my-blog
npm init -y
npm install astro
```

## 第二步：了解项目结构

创建好的项目目录结构如下：

```
my-blog/
├── public/              # 静态资源（favicon 等）
├── src/
│   ├── components/      # 可复用组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   └── FormattedDate.astro
│   ├── content/
│   │   └── blog/        # 博客文章（Markdown 文件）
│   ├── layouts/         # 页面布局模板
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   ├── pages/           # 页面路由
│   │   ├── index.astro       # 首页
│   │   ├── about.astro       # 关于页
│   │   └── blog/
│   │       ├── index.astro   # 文章列表页
│   │       └── [...slug].astro  # 文章详情页（动态路由）
│   ├── styles/
│   │   └── global.css   # 全局样式
│   ├── consts.ts        # 全局常量（博客名称等）
│   └── content.config.ts # 内容集合配置
├── astro.config.mjs     # Astro 配置文件
├── package.json
└── tsconfig.json
```

几个关键文件的作用：

- **`content.config.ts`** — 定义博客文章的数据结构（标题、日期、标签等）
- **`astro.config.mjs`** — 配置站点 URL、插件等
- **`[...slug].astro`** — Astro 的动态路由，每篇 Markdown 文章自动生成一个页面

## 第三步：写一篇博客文章

在 `src/content/blog/` 目录下创建一个 Markdown 文件，例如 `my-first-post.md`：

```markdown
---
title: "我的第一篇文章"
description: "这是文章的简短描述"
pubDate: 2026-03-18
tags: ["随笔"]
---

在这里写你的文章内容。

支持所有标准的 Markdown 语法：

- **粗体**、*斜体*
- [链接](https://example.com)
- 代码块、引用、列表等
```

文件顶部 `---` 之间的部分叫做 **frontmatter**，用于定义文章的元数据。

## 第四步：本地预览

```bash
npm run dev
```

打开浏览器访问 `http://localhost:4321`，就能看到你的博客了。修改文件会自动热更新。

## 第五步：配置 GitHub Pages 部署

### 5.1 修改 Astro 配置

编辑 `astro.config.mjs`，设置你的 GitHub Pages 地址：

```javascript
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://你的用户名.github.io",
  // 如果仓库名不是 "用户名.github.io"，需要加上 base：
  // base: "/仓库名",
});
```

### 5.2 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5.3 推送到 GitHub

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "init: 搭建 Astro 博客"

# 在 GitHub 上创建一个新仓库，然后关联并推送
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 5.4 启用 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 进入 **Settings** → **Pages**
3. 在 **Source** 下拉框中选择 **GitHub Actions**
4. 等待 Actions 运行完成，你的博客就上线了！

访问 `https://你的用户名.github.io/仓库名/` 查看效果。

## 日常使用

博客搭好之后，日常写文章的流程非常简单：

```bash
# 1. 在 src/content/blog/ 下新建 .md 文件，写好内容
# 2. 本地预览
npm run dev

# 3. 满意后提交并推送
git add .
git commit -m "发布新文章：文章标题"
git push
```

推送后 GitHub Actions 会自动构建并部署，通常 1-2 分钟后博客就更新了。

## 进阶优化（可选）

搭好基础博客后，你还可以：

- **添加 RSS 订阅** — 安装 `@astrojs/rss`
- **添加站点地图** — 安装 `@astrojs/sitemap`
- **自定义域名** — 在 GitHub Pages 设置中配置，购买域名后设置 CNAME 记录
- **添加评论系统** — 推荐 [giscus](https://giscus.app/)（基于 GitHub Discussions，免费）
- **添加搜索功能** — 使用 [pagefind](https://pagefind.app/)
- **添加暗色模式切换按钮** — 用 JS 控制 CSS 变量

## 总结

整个搭建过程总结下来就四步：

1. `npm create astro` 创建项目
2. 在 `src/content/blog/` 下用 Markdown 写文章
3. 配置 GitHub Actions 自动部署
4. 推送到 GitHub，博客自动上线

Astro + GitHub Pages 的组合对学生来说是最佳方案：**完全免费、速度快、Markdown 写作舒适、部署自动化**。祝你写博客愉快！
