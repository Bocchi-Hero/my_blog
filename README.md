# Ink & Interval Blog

一个基于 Astro 的双语个人博客，强调阅读体验、克制排版和长期写作。

English version: `README.en.md`

## 1. 技术框架与依赖

### 核心框架
- `Astro 5`：静态站点生成（SSG）与页面路由。
- `TypeScript`：用于内容类型、i18n 工具和站点常量。

### Astro 集成与工具
- `@astrojs/sitemap`：构建时生成 `sitemap.xml`。
- `astro:content` + `zod` schema：校验博客 frontmatter 字段。
- `Shiki (github-light)`：Markdown 代码高亮主题（在 `astro.config.mjs` 中配置）。

### 前端实现方式
- 无 UI 框架（非 React/Vue），采用 `.astro` + 原生 CSS。
- 站点搜索是原生前端交互（输入过滤 + 下拉结果），未接第三方搜索服务。

## 2. 页面与排版系统

### 页面结构
- `src/layouts/BaseLayout.astro`：全站基础布局（Header / Main / Footer）。
- `src/layouts/BlogPost.astro`：文章页布局（左侧目录 + 中间正文）。
- `src/components/*`：首页、归档页、关于页、404、搜索、卡片等组件。

### 路由与语言
- 中文主路径：`/`
- 英文路径前缀：`/en/`
- 语言切换和链接构建由 `src/i18n.ts` 维护。

### 当前排版策略
- 全站容器变量定义在 `src/styles/global.css`：
  - `--container-home: 1160px`（常规页面最大内容宽度）
  - `--container-read: 780px`（阅读型内容基线宽度）
- 文章页（`BlogPost.astro`）采用三列网格：
  - 左列：目录（sticky，随滚动固定在视口）
  - 中列：正文（当前约 `880px`）
  - 右列：留白，用于保持正文视觉居中
- 顶栏集成搜索框，支持按标题/摘要/标签筛选文章。

## 3. 字体与视觉风格

### 字体分配
- 标题类（`h1-h6`、导航等）：`Tiempos Text`（display 字体）
- 正文类（段落、输入等）：`Fraunce / Fraunces`（body 字体）

### 字体加载方式
- `Fraunces` 通过 Google Fonts 在 `BaseLayout.astro` 中加载。
- `Tiempos Text` 作为首选 display 字体，若本地或线上无该字体，会回退到：
  - `Tiempos`, `Georgia`, `Palatino Linotype`, `Noto Serif SC`, `Songti SC`, `serif`

### 视觉基调
- 暖色纸感背景、低对比边框、正文高行高（`line-height: 1.8`）。
- 标题偏厚（`font-weight: 600`）并使用紧字距（`letter-spacing: -0.03em`）。

## 4. 内容系统（文章规范）

博客内容放在 `src/content/blog/`，支持 `.md` 和 `.mdx`。

frontmatter 字段（由 `src/content.config.ts` 校验）：
- 必填：`title`, `description`, `pubDate`
- 可选：`titleEn`, `descriptionEn`, `updatedDate`, `heroImage`
- 标签：`tags`, `tagsEn`（默认空数组）

## 5. 本地运行方式

### 环境要求
- Node.js（建议使用 LTS 版本）
- npm

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
默认地址通常是：
- `http://localhost:4321`

### 生产构建
```bash
npm run build
```

### 本地预览构建产物
```bash
npm run preview
```

### 查看 Astro CLI 帮助
```bash
npm run astro -- --help
```

## 6. 部署与环境变量

项目已考虑 GitHub Pages 场景（见 `astro.config.mjs`）：
- `GITHUB_REPOSITORY`：用于推导 `base` 路径（仓库页/用户页）
- `SITE_URL`：站点主域名
- `VITE_CACHE_DIR`：可选，自定义 Vite 缓存目录

如未设置，配置会使用默认推导值。

## 7. 目录结构（简版）

```text
src/
  components/      # 组件（Header、Footer、搜索、卡片等）
  content/blog/    # 博客文章
  layouts/         # 页面布局
  pages/           # 路由页面
  styles/          # 全局样式
public/            # 静态资源
.github/workflows/ # 部署工作流
```
