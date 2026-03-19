---
locale: "en"
translationKey: "build-astro-blog"
slug: "en-build-astro-blog"
title: "Build an Astro blog from scratch and deploy it to GitHub Pages"
description: "A step-by-step guide to building a personal Astro blog and deploying it to GitHub Pages for free."
pubDate: 2026-03-18
tags: ["Tutorial", "Astro", "GitHub Pages"]
---

This post records the complete process I used to build this blog from scratch. The stack is simple: **Astro** for the static site, **GitHub Pages** for free hosting, and **GitHub Actions** for automatic deployment.

## Why choose Astro?

| Feature | Why it matters |
|------|------|
| Fast by default | Astro ships very little JavaScript, so pages load quickly |
| Markdown-first | Writing posts in Markdown or MDX feels natural |
| Flexible | You can still mix in React, Vue, or Svelte when needed |
| Easy deployment | Static output works well with many free hosting platforms |

## Before you start

Make sure these tools are installed:

- **Node.js** version 18 or later
- **Git**
- **A GitHub account**

You can verify them in the terminal:

```bash
node --version
npm --version
git --version
```

## Step 1: Create the project

Open a terminal and run:

```bash
# Create a new Astro blog from the official starter
npm create astro@latest -- my-blog --template blog

# Enter the project folder
cd my-blog

# Install dependencies
npm install
```

If the template download fails because of network issues, you can also set up a project manually:

```bash
mkdir my-blog && cd my-blog
npm init -y
npm install astro
```

## Step 2: Understand the structure

A typical Astro blog project looks like this:

```text
my-blog/
├── public/              # Static assets such as favicon
├── src/
│   ├── components/      # Reusable UI pieces
│   ├── content/
│   │   └── blog/        # Markdown posts
│   ├── layouts/         # Shared page shells
│   ├── pages/           # Route files
│   ├── styles/          # Global styles
│   ├── consts.ts        # Site-wide constants
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

A few especially important files:

- `content.config.ts` defines the post schema
- `astro.config.mjs` controls site URL, integrations, and output behavior
- `src/pages/blog/[...slug].astro` turns Markdown posts into individual pages

## Step 3: Write your first post

Create a Markdown file inside `src/content/blog/`, for example `my-first-post.md`:

```markdown
---
title: "My first post"
description: "A short description of the post"
pubDate: 2026-03-18
tags: ["Notes"]
---

Write your article here.

Markdown supports:

- **Bold** and *italic*
- [Links](https://example.com)
- Code blocks, quotes, lists, and more
```

The block between the `---` lines is the **frontmatter**. It stores metadata like the title, date, and tags.

## Step 4: Preview locally

```bash
npm run dev
```

Then open `http://localhost:4321` in your browser. Astro will hot-reload the page whenever you save a file.

## Step 5: Deploy to GitHub Pages

### 5.1 Configure Astro

Edit `astro.config.mjs` and set your site URL:

```javascript
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://your-username.github.io",
  // If the repository is not a user site, also set:
  // base: "/your-repo-name",
});
```

### 5.2 Add a GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

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

### 5.3 Push the repository

```bash
git init
git add .
git commit -m "init: set up Astro blog"

git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 5.4 Enable GitHub Pages

1. Open your repository on GitHub
2. Go to **Settings** -> **Pages**
3. Choose **GitHub Actions** as the source
4. Wait for the workflow to finish

Your site should then be available at `https://your-username.github.io/your-repo-name/`.

## Day-to-day workflow

Once the blog is ready, the publishing flow stays simple:

```bash
# Write a new Markdown file in src/content/blog/
npm run dev

# When you're happy with the result
git add .
git commit -m "docs: publish a new post"
git push
```

GitHub Actions will build and deploy the new version automatically.

## Optional upgrades

After the foundation is in place, you can keep improving the site:

- Add RSS with `@astrojs/rss`
- Generate a sitemap with `@astrojs/sitemap`
- Use a custom domain
- Add comments with [giscus](https://giscus.app/)
- Add site search with [Pagefind](https://pagefind.app/)
- Add a dark mode toggle with CSS variables and a small script

## Summary

The full process can be reduced to four steps:

1. Create the Astro project
2. Write posts in `src/content/blog/`
3. Configure GitHub Actions for deployment
4. Push to GitHub and let the workflow publish the site

For a personal site, Astro plus GitHub Pages is a great combination: it is free, fast, comfortable for Markdown writing, and easy to maintain over time.
