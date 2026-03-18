import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const [owner = "yourusername", repository = ""] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isUserSite = repository.endsWith(".github.io");
const base = repository && !isUserSite ? `/${repository}` : "/";
const site = process.env.SITE_URL ?? `https://${owner}.github.io`;

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
  vite: {
    cacheDir: process.env.VITE_CACHE_DIR ?? "node_modules/.vite",
  },
});
