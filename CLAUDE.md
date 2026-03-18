# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (also the pre-merge verification step; no test suite exists)
- `npm run preview` — Serve the built site locally

## Architecture

Astro 5 static blog ("Ink & Interval") deployed to GitHub Pages. Pure Astro components — no React/Vue/Svelte. TypeScript strict mode.

### Bilingual (zh/en) routing

Chinese is the default locale at `/`, English lives under `/en/`. Locale is detected from the URL path via `getLocaleFromPathname()` in `src/i18n.ts`. Every page that exists at `/foo` has a mirror at `/en/foo`.

Pages under `src/pages/` duplicate the route tree: `src/pages/blog/` (Chinese) and `src/pages/en/blog/` (English). Both render the same shared components (`HomePage`, `ArchivePage`, `AboutPage`, `NotFoundPage`) by passing a `locale` prop.

### Content collections

Blog posts are single Markdown files in `src/content/blog/` with bilingual frontmatter fields:
- Required: `title`, `description`, `pubDate`
- Optional English overrides: `titleEn`, `descriptionEn`, `tagsEn`
- Optional: `updatedDate`, `heroImage`, `tags`

Use helpers in `src/content-utils.ts` (`getLocalizedPostTitle`, `getLocalizedPostDescription`, `getLocalizedPostTags`) to resolve the correct locale field with Chinese fallback.

### Internal links

Always use `withBase()` from `src/consts.ts` for internal hrefs. It prepends `BASE_URL` so links work on both user sites (`/`) and project sites (`/repo-name/`). The i18n helper `localePath(locale, path)` already calls `withBase()`.

### Layouts

- `BaseLayout.astro` — HTML shell, header, footer. Receives `title`, `description`, `locale`.
- `BlogPost.astro` — Wraps `BaseLayout`; adds a fixed left sidebar with collapsible TOC (state persisted in localStorage) and reading-time estimate.

### Styling

Global design tokens (colors, typography, spacing) in `src/styles/global.css` as CSS custom properties. Component styles are scoped `<style>` blocks inside `.astro` files. Warm beige/orange palette. No Tailwind.

## Conventions

- 2-space indentation in `.astro`, `.ts`, and Markdown
- Double quotes in TypeScript
- PascalCase for `.astro` component filenames
- Reuse design tokens from `src/styles/global.css`; avoid hardcoded color/spacing values
- Blog frontmatter must conform to the schema in `src/content.config.ts`

## Environment variables

- `SITE_URL` — Overrides the generated `site` in `astro.config.mjs`
- `GITHUB_REPOSITORY` — Auto-detected; drives `site` and `base` for GitHub Pages
- `VITE_CACHE_DIR` — Custom Vite cache directory
