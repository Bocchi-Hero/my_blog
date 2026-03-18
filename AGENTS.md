# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro blog. Route files live in `src/pages/`, shared UI in `src/components/`, and page shells in `src/layouts/`. Blog content is stored as Markdown or MDX in `src/content/blog/` and validated by `src/content.config.ts`. Global styles live in `src/styles/global.css`, while static assets such as `favicon.svg` belong in `public/`. GitHub Pages deployment is defined in `.github/workflows/deploy.yml`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Astro dev server for local authoring.
- `npm run build`: create the production site output and catch route/content build errors.
- `npm run preview`: serve the built site locally to verify the production result.
- `npm run astro -- --help`: inspect additional Astro CLI tasks available in this repo.

## Coding Style & Naming Conventions
Use 2-space indentation in `.astro`, `.ts`, and Markdown examples, matching the existing code. Prefer double quotes in TypeScript and keep Astro components in PascalCase, such as `BlogCard.astro` and `BaseLayout.astro`. Keep route files descriptive and aligned with URLs, for example `src/pages/about.astro` and `src/pages/blog/index.astro`. Reuse design tokens from `src/styles/global.css` and the `withBase()` helper from `src/consts.ts` for internal links.

## Testing Guidelines
There is no dedicated unit test suite configured yet. Treat `npm run build` as the required pre-merge verification step because it exercises content loading, static path generation, and page rendering. When adding blog posts, keep frontmatter aligned with the `blog` schema: `title`, `description`, `pubDate`, optional `updatedDate`, optional `heroImage`, and `tags`.

## Commit & Pull Request Guidelines
Local `.git` history is not available in this checkout, so no repository-specific commit format can be inferred. Use short, imperative commit subjects such as `Add about page hero copy` or `Refine blog card spacing`. Keep pull requests focused, describe user-visible changes, link the relevant issue when applicable, and include screenshots for layout or style updates. Note any changes to `SITE_URL`, `GITHUB_REPOSITORY`, or GitHub Pages behavior because they affect `site` and `base` generation in `astro.config.mjs`.
