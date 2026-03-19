import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

const [owner = "yourusername", repository = ""] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isUserSite = repository.endsWith(".github.io");
const base = repository && !isUserSite ? `/${repository}` : "/";
const site = process.env.SITE_URL ?? `https://${owner}.github.io`;

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: "github-light",
    },
  },
  vite: {
    cacheDir: process.env.VITE_CACHE_DIR ?? "node_modules/.vite",
  },
});
