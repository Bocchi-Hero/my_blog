import type { CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";

export function getLocalizedPostTitle(post: CollectionEntry<"blog">, locale: Locale) {
  return locale === "en" ? post.data.titleEn ?? post.data.title : post.data.title;
}

export function getLocalizedPostDescription(post: CollectionEntry<"blog">, locale: Locale) {
  return locale === "en" ? post.data.descriptionEn ?? post.data.description : post.data.description;
}

export function getLocalizedPostTags(post: CollectionEntry<"blog">, locale: Locale) {
  if (locale === "en" && post.data.tagsEn.length > 0) {
    return post.data.tagsEn;
  }
  return post.data.tags;
}
