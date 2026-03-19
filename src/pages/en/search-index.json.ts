import type { APIRoute } from "astro";
import { createPostSearchItems, getSortedPosts } from "../../content-utils";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts("en");
  return new Response(JSON.stringify(createPostSearchItems(posts, "en")), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
