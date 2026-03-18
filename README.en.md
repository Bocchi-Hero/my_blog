# Ink & Interval Blog

A bilingual personal blog built with Astro, focused on calm reading, restrained layout, and long-term writing.

Chinese version: `README.md`

## 1. Frameworks and Dependencies

### Core Stack
- `Astro 5`: static site generation (SSG) and file-based routing.
- `TypeScript`: used for content typing, i18n utilities, and shared constants.

### Astro Integrations and Tooling
- `@astrojs/sitemap`: generates `sitemap.xml` during build.
- `astro:content` + `zod` schema: validates blog frontmatter fields.
- `Shiki (github-light)`: Markdown code highlighting theme (configured in `astro.config.mjs`).

### Frontend Implementation
- No UI framework (no React/Vue); built with `.astro` files + native CSS.
- Search is a native client-side interaction (input filter + dropdown), without third-party search services.

## 2. Layout and Typography System

### Page Structure
- `src/layouts/BaseLayout.astro`: global shell (Header / Main / Footer).
- `src/layouts/BlogPost.astro`: post layout (left table of contents + centered article body).
- `src/components/*`: home, archive, about, 404, search, cards, and shared UI.

### Routing and Language
- Chinese default path: `/`
- English path prefix: `/en/`
- Language switching and localized path building are handled in `src/i18n.ts`.

### Current Layout Strategy
- Global container tokens in `src/styles/global.css`:
  - `--container-home: 1160px` (general page width)
  - `--container-read: 780px` (reading baseline width)
- Post pages (`BlogPost.astro`) use a three-column grid:
  - Left: sticky table of contents
  - Center: article body (currently around `880px`)
  - Right: whitespace to keep the article visually centered
- Search is integrated in the top header and filters by title/description/tags.

## 3. Fonts and Visual Style

### Font Roles
- Headings (`h1-h6`, navigation, etc.): `Tiempos Text` (display font)
- Body text (paragraphs, inputs, etc.): `Fraunce / Fraunces` (body font)

### Font Loading
- `Fraunces` is loaded from Google Fonts in `BaseLayout.astro`.
- `Tiempos Text` is the preferred display font; if unavailable, the fallback chain is:
  - `Tiempos`, `Georgia`, `Palatino Linotype`, `Noto Serif SC`, `Songti SC`, `serif`

### Visual Direction
- Warm paper-like background, low-contrast borders, generous text line-height (`1.8`).
- Heavier headings (`font-weight: 600`) with tight tracking (`letter-spacing: -0.03em`).

## 4. Content System (Post Rules)

Blog posts live in `src/content/blog/` and support `.md` and `.mdx`.

Frontmatter fields (validated by `src/content.config.ts`):
- Required: `title`, `description`, `pubDate`
- Optional: `titleEn`, `descriptionEn`, `updatedDate`, `heroImage`
- Tags: `tags`, `tagsEn` (default to empty arrays)

## 5. Run Locally

### Requirements
- Node.js (LTS recommended)
- npm

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Default local URL is usually:
- `http://localhost:4321`

### Production Build
```bash
npm run build
```

### Preview Built Output
```bash
npm run preview
```

### Astro CLI Help
```bash
npm run astro -- --help
```

## 6. Deployment and Environment Variables

The project is configured for GitHub Pages scenarios (see `astro.config.mjs`):
- `GITHUB_REPOSITORY`: used to infer the `base` path (repo site vs user site)
- `SITE_URL`: canonical site URL
- `VITE_CACHE_DIR`: optional custom Vite cache directory

If these are not set, the config falls back to derived defaults.

## 7. Project Structure (Short)

```text
src/
  components/      # Header, Footer, search, cards, and shared UI
  content/blog/    # Blog posts
  layouts/         # Page layouts
  pages/           # Route pages
  styles/          # Global styles
public/            # Static assets
.github/workflows/ # Deployment workflow
```
