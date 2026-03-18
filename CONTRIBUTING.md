# Contributing Guide

本项目采用「`main` 只放可发布内容」的长期维护策略。

## Branch Strategy

- `main`: 始终保持可发布、可回滚。
- 日常开发请使用短分支：
  - `post/*`：文章内容
  - `feat/*`：新功能
  - `fix/*`：修复
  - `docs/*`：文档

示例：
- `post/2026-03-astro-tips`
- `feat/header-search`
- `fix/toc-layout`

## Commit Conventions

使用简短祈使句，建议前缀：
- `post: add "xxx" article`
- `feat: move search to header`
- `fix: widen article layout and left toc`
- `docs: add bilingual README`

## Recommended Flow

1. 从 `main` 拉最新代码并创建短分支。
2. 小步提交（一个目标一组提交）。
3. 推送分支并发起 PR 到 `main`。
4. 通过 CI（至少 `npm run build`）。
5. 使用 `Squash and merge` 合并。
6. 合并后由 `main` 触发 Pages 部署。

## Pull Request Checklist

- 改动范围聚焦（单一主题）。
- 本地执行通过：`npm run build`。
- 影响 UI 时附截图（桌面 + 移动端）。
- 如涉及 `SITE_URL`、`GITHUB_REPOSITORY`、路由/部署行为，需在 PR 描述中明确说明。

## Branch Protection (Recommended)

建议在 GitHub 仓库设置中开启：
- `main` 必须通过 PR 合并（禁止直接 push）。
- 必须通过状态检查（本仓库建议至少启用 `Build (PR)`）。
