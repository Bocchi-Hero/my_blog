---
title: "用我的博客项目学 Git：一篇够用的实战入门"
titleEn: "Learn Git with my blog project: a practical beginner guide"
description: "不空讲命令，直接结合这个 Astro 博客的真实提交历史，带你理解 Git 在个人项目里的实际用法。"
descriptionEn: "A practical Git guide based on the real commit history of this Astro blog project."
pubDate: 2026-03-19
tags: ["教程", "Git", "博客"]
tagsEn: ["Tutorial", "Git", "Blog"]
---

第一次学 Git 时，最容易遇到的问题不是命令太多，而是场景太空。

你知道 `git init` 是初始化仓库，知道 `git add .` 是暂存文件，也知道 `git commit -m "xxx"` 是创建一次提交。但一旦把这些命令放进一个真实项目里，很多问题马上就来了：

- 第一次提交到底应该提交到什么程度？
- 哪些文件应该进仓库，哪些不应该？
- 提交信息怎么写，回头自己才看得懂？
- 写完一篇文章、改完一个样式，Git 应该怎么配合我的发布流程？

这篇文章不打算拿一个空文件夹举例，而是直接拿我这个博客仓库来讲。

它是一个用 **Astro** 搭建、部署到 **GitHub Pages** 的个人博客，仓库里已经有一段很完整的真实历史。对于初学者来说，这种案例比只背命令有用得多，因为你看到的不是“Git 能做什么”，而是“Git 在一个项目里到底是怎么被用起来的”。

如果你想先了解这个博客本身是怎么搭起来的，可以先读：[从零搭建 Astro 个人博客并部署到 GitHub Pages](../build-astro-blog/)。

## 先从这条提交历史开始

我先贴几条这个仓库里最有代表性的提交：

```text
01237d2 first commit
9229bac readme
8a50a72 chore: keep repo clean and enforce PR workflow
3e61e81 feat: rebrand site and add author profile links
85684eb fix: correct post link and widen article layout on pages
467248e style: keep centered layout and shift toc left only
12bad23 feat: use provided avatar image
```

如果你已经会一点 Git，应该能从这些名字里读出一点项目演进的味道：

- 有最初版本落地时的 `first commit`
- 有补充说明文档的 `readme`
- 有清理仓库的 `chore`
- 有功能新增的 `feat`
- 有修 bug 的 `fix`
- 也有纯样式调整的 `style`

Git 真正的价值，其实就藏在这种“能把一个项目的变化过程保存下来”这件事里。

## 第一次提交，不求完美，先留下起点

这个博客最开始也是从一个刚创建好的 Astro 项目起步的。典型流程大概会像这样：

```bash
npm create astro@latest my-blog -- --template blog
cd my-blog
git init
git status
git add .
git commit -m "first commit"
```

很多人第一次提交时会犹豫：“现在项目还很粗糙，要不要再等等？”  
我的建议是，不要等。

第一次提交的意义，不是把项目做完，而是把**第一个能运行的版本**固定下来。以后你改坏了布局、删错了组件、调崩了配置，哪怕只是想回头看看“最开始长什么样”，这个提交都会非常有价值。

这个仓库的第一条历史就是：

```text
01237d2 first commit
```

它不华丽，也不复杂，但它把整个项目的起点保存了下来。

对初学者来说，这一步很重要。因为 Git 不是只在“项目成熟以后”才有用，恰恰相反，它应该从项目一开始就介入。

## `git status` 是你最应该养成习惯的命令

如果说 Git 里有一个命令最值得反复用，那不是 `git commit`，而是：

```bash
git status
```

很多初学者出问题，不是不会提交，而是根本不知道自己正在提交什么。

`git status` 的作用很像仪表盘。它会告诉你：

- 哪些文件被改了
- 哪些文件已经进入暂存区
- 哪些文件还是未跟踪状态

在这个博客项目里，我越来越习惯在三个时刻看它：

1. 开始改东西之前看一次，确认工作区是干净的
2. 准备提交之前看一次，确认没有带上无关文件
3. 推送之前再看一次，确认这次改动真的已经整理好了

这个习惯看起来很小，但能帮你避开很多低级错误，比如：

- 把本地测试文件一起提交了
- 顺手改过的配置文件忘了检查
- 明明只想提交一篇文章，却把别的实验性改动也带上去了

如果你现在还没有形成习惯，可以从今天开始试试：**每次 commit 前先跑一次 `git status`。**

## 不是所有文件都应该进 Git 仓库

这个博客仓库里，其实有过一次很典型的“早期项目常见错误”。

在最开始的提交里，除了源码和配置，还混进来了一些本地运行产生的文件，比如工具状态、缓存和日志文件。它们当时也被提交了进去。后来才专门补了一次清理：

```text
8a50a72 chore: keep repo clean and enforce PR workflow
```

这次提交很有代表性，因为它做的不是“新功能”，而是把仓库变得更像一个可以长期维护的项目。

这个博客现在的 `.gitignore` 里会忽略这些内容：

```text
dist/
node_modules/
.astro/
.omc/
.vite-temp/
.vite-cache-*/
dev*.log
dev*.err
AGENTS.md
CLAUDE.md
```

你可以把它简单理解成两类：

应该提交的：

- 源码
- 内容文件
- 配置文件
- 部署工作流

不该提交的：

- 依赖目录
- 构建产物
- 缓存
- 日志
- 本地工具状态

很多新手第一次接触 Git 时，会把“提交成功”理解成“所有东西都交上去”。其实正相反，好的仓库管理强调的是**有选择地提交**。

如果你发现仓库里开始出现越来越多奇怪的临时文件，不要只是提醒自己“下次注意”，更有效的做法是立刻完善 `.gitignore`。

## 提交信息，决定了你以后能不能看懂自己的历史

我觉得 Git 最容易被低估的部分，是提交信息。

刚开始用 Git 的时候，很多人都写过类似的提交：

```text
改一下
再试试
修复
更新
右移目录
```

短期内当然也能用，因为你还记得自己刚刚改了什么。但只要时间一拉长，这些提交信息几乎等于没写。

这个博客仓库后面的提交就比一开始清晰很多，比如：

```text
feat: rebrand site and add author profile links
fix: correct post link and widen article layout on pages
style: keep centered layout and shift toc left only
chore: keep repo clean and enforce PR workflow
```

这种写法的好处是，它同时回答了两个问题：

1. 这次改动是什么类型
2. 这次改动大概做了什么

对个人项目来说，我觉得常用的几个前缀已经够用了：

| 前缀 | 用途 |
|------|------|
| `feat` | 新功能、新页面、新交互 |
| `fix` | 修复错误或异常行为 |
| `style` | 纯视觉样式、排版微调 |
| `docs` | 文档或博客文章更新 |
| `chore` | 工程清理、配置维护、杂项整理 |

比如，如果你今天只是给博客新增了一篇文章，那么比起：

```bash
git commit -m "更新"
```

更建议写成：

```bash
git commit -m "docs: publish git tutorial for my blog"
```

它不一定非得用英文，也不一定非得严格遵守某种规范，但至少要让“未来的你”一眼知道这次提交在干什么。

## 一次好的提交，最好只做一件事

Git 另一个很容易被忽略的原则是：**让每次提交尽量单一。**

假设今天你做了三件事：

- 新写了一篇文章
- 顺手改了博客页边距
- 又调整了一个头像资源

这三件事当然都可以一起提交，但以后回看历史、定位问题、甚至只是想撤销其中一个改动时，都会变得很麻烦。

更稳的做法是把它们拆开。

比如写文章时，你可以这样做：

```bash
git status
git diff
git add src/content/blog/git-guide-with-my-blog.md
git diff --staged
git commit -m "docs: publish git tutorial for my blog"
```

这里最关键的一点是：不一定每次都要 `git add .`。

`git add .` 很方便，但也很容易把不相关的改动一起卷进去。  
如果你知道自己这次只想提交某一篇文章、某一个组件、某一个样式文件，那就直接点名添加它。

提交越单一，历史越清楚，回退越安全。

## Git 不只是保存代码，它还在帮你理解项目怎么长成今天这样

我很喜欢翻自己的提交历史，因为它会把很多“我已经忘了的开发过程”重新变得清晰。

拿这个博客来说，只看历史，大概就能读出这样一条演进线：

1. 先把博客主体搭起来，完成 `first commit`
2. 补 `README`，让项目说明更完整
3. 发现仓库里混进了缓存和日志，于是补 `.gitignore` 并清理
4. 持续调整文章页目录、版心宽度和中文排版
5. 给站点做更明确的个人化 branding
6. 最后接入正式头像图片

这时候 Git 就已经不只是一个“备份工具”了。它更像项目的时间轴，帮你理解：

- 某个功能是什么时候出现的
- 某个页面为什么被改成现在这样
- 某个问题曾经是怎么被修掉的

如果你想看得更具体一点，可以用：

```bash
git log --oneline --graph --decorate
```

想看某一次提交到底改了哪些文件，可以用：

```bash
git show 3e61e81 --stat
```

比如这个仓库里的 `feat: rebrand site and add author profile links`，就能清楚看到它主要动了 `AboutPage.astro`、`Footer.astro`、`src/consts.ts` 和头像资源。

这比“我记得我以前好像调过这里”可靠得多。

## 对这个博客来说，`git push` 基本就等于“准备上线”

这个项目有一点很适合拿来讲 Git 的实际价值：它不是只有本地代码管理，还接上了自动部署。

仓库里有一个 GitHub Pages 工作流：

```text
.github/workflows/deploy.yml
```

它会在 `main` 分支收到推送后自动构建并部署站点。也就是说，对这个博客来说，完整流程通常是这样的：

1. 修改内容或代码
2. `git status`
3. `git add`
4. `git commit`
5. `npm run build`
6. `git push origin main`
7. 等 GitHub Actions 发布完成

这也是为什么我现在会把 Git 看成博客工作流的一部分，而不是一个额外步骤。

你写完文章、调完样式、修完 bug，最终都要通过一次提交和一次推送，变成线上站点的一部分。  
从这个角度看，Git 记录的其实不只是代码变化，也是在记录你的博客如何一次次被更新、被打磨、被发布。

## 如果你也在写个人博客，我建议这样用 Git

对个人博客项目来说，其实不需要太复杂的 Git 策略。保持简单、清晰、稳定，就已经足够好用了。

我比较推荐下面这套日常流程：

### 写新文章时

```bash
git status
git add src/content/blog/新文章.md
git commit -m "docs: publish a new blog post"
npm run build
git push origin main
```

### 修页面问题时

```bash
git status
git add src/components src/layouts src/styles
git commit -m "fix: improve post layout on small screens"
npm run build
git push origin main
```

### 调整样式时

```bash
git status
git add src/styles/global.css src/layouts/BlogPost.astro
git commit -m "style: rebalance article width and toc spacing"
npm run build
git push origin main
```

这些命令表面上看差不多，但核心区别在于两点：

- 暂存范围是明确的
- 提交信息是可读的

只要这两点做好，你的 Git 历史通常就不会太难看。

## 写在最后

如果只把 Git 当成一套命令，它确实会显得有点枯燥；但一旦把它放进真实项目里，你会发现它其实一直在做三件很具体的事：

1. 帮你保存每一个阶段性的结果
2. 帮你解释每一次改动为什么存在
3. 帮你在未来继续修改时更有安全感

这个博客仓库就是一个很好的例子。

它从最初的 `first commit` 开始，经历过不够整洁的提交，也经历过后来的清理、修复、重构和持续打磨。正因为这些过程都被 Git 记录下来了，我今天才能把它们重新整理成一篇教程。

所以如果你刚开始学 Git，不用急着把所有命令一次学全。先把最重要的几个动作用在你自己的项目里：

- 看状态
- 选文件
- 写清楚提交信息
- 推送前先构建

等你真的这样用上一段时间，Git 自然就不会再只是“背命令”了。
