import { getCollection, type CollectionEntry } from "astro:content";
import { localePath, type Locale } from "./i18n";

const CHINESE_CHARS_PER_MINUTE = 300;
const ENGLISH_WORDS_PER_MINUTE = 220;
const CJK_CHAR_REGEX = /[\u3400-\u9FFF]/g;

export type BlogPostEntry = CollectionEntry<"blog">;

export interface PostSearchItem {
  title: string;
  description: string;
  url: string;
  keywords: string;
  tags: string[];
}

export interface TagSummary {
  name: string;
  slug: string;
  count: number;
  url: string;
}

function sortPosts(posts: BlogPostEntry[]) {
  return posts.sort((a, b) => {
    const dateDiff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    if (dateDiff !== 0) {
      return dateDiff;
    }
    return getPostSlug(a).localeCompare(getPostSlug(b));
  });
}

export function getPostLocale(post: BlogPostEntry): Locale {
  if (post.data.locale) {
    return post.data.locale;
  }
  return post.id.startsWith("en/") ? "en" : "zh";
}

export function getPostSlug(post: BlogPostEntry) {
  if (post.data.translationKey?.trim()) {
    return post.data.translationKey.trim();
  }
  if (post.data.slug?.trim()) {
    return post.data.slug.trim();
  }
  const segments = post.id.split("/");
  return segments[segments.length - 1];
}

export function getPostTranslationKey(post: BlogPostEntry) {
  if (post.data.translationKey?.trim()) {
    return post.data.translationKey.trim();
  }
  return getPostSlug(post);
}

export async function getAllPosts(): Promise<BlogPostEntry[]> {
  return getCollection("blog");
}

export async function getSortedPosts(locale?: Locale): Promise<BlogPostEntry[]> {
  const posts = await getAllPosts();
  const filtered = locale ? posts.filter((post) => getPostLocale(post) === locale) : posts;
  return sortPosts(filtered);
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const posts = await getSortedPosts(locale);
  return posts.find((post) => getPostSlug(post) === slug);
}

export function groupPostsByYear(posts: BlogPostEntry[]) {
  const groups = new Map<number, BlogPostEntry[]>();

  posts.forEach((post) => {
    const year = post.data.pubDate.getFullYear();
    const group = groups.get(year) ?? [];
    group.push(post);
    groups.set(year, group);
  });

  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, groupPosts]) => ({
      year,
      posts: sortPosts(groupPosts),
    }));
}

export function slugifyTag(tag: string) {
  return tag
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTagSummaries(posts: BlogPostEntry[], locale: Locale): TagSummary[] {
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    getLocalizedPostTags(post, locale).forEach((tag) => {
      const normalized = tag.trim();
      if (!normalized) {
        return;
      }
      tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({
      name,
      slug: slugifyTag(name),
      count,
      url: localePath(locale, `/tags/${slugifyTag(name)}/`),
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
}

export function findTagBySlug(posts: BlogPostEntry[], locale: Locale, slug: string) {
  return getTagSummaries(posts, locale).find((tag) => tag.slug === slug);
}

export function getAdjacentPosts(posts: BlogPostEntry[], slug: string) {
  const index = posts.findIndex((post) => getPostSlug(post) === slug);
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: posts[index + 1],
    next: posts[index - 1],
  };
}

export function getRelatedPosts(
  post: BlogPostEntry,
  posts: BlogPostEntry[],
  locale: Locale,
  limit = 3
) {
  const sourceTags = new Set(getLocalizedPostTags(post, locale));

  return posts
    .filter((candidate) => getPostSlug(candidate) !== getPostSlug(post))
    .map((candidate) => {
      const overlap = getLocalizedPostTags(candidate, locale).filter((tag) => sourceTags.has(tag)).length;
      return { candidate, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) {
        return b.overlap - a.overlap;
      }
      return b.candidate.data.pubDate.valueOf() - a.candidate.data.pubDate.valueOf();
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function createPostSearchItems(
  posts: BlogPostEntry[],
  locale: Locale
): PostSearchItem[] {
  return posts.map((post) => {
    const title = getLocalizedPostTitle(post, locale);
    const description = getLocalizedPostDescription(post, locale);
    const tags = getLocalizedPostTags(post, locale);

    return {
      title,
      description,
      tags,
      url: localePath(locale, `/blog/${getPostSlug(post)}/`),
      keywords: `${title} ${description} ${tags.join(" ")}`.toLowerCase(),
    };
  });
}

export function estimateReadingTime(body: string | undefined, locale?: Locale): number {
  const source = body ?? "";
  const hanChars = source.match(CJK_CHAR_REGEX)?.length ?? 0;
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  const shouldUseChinese = locale === "zh" || (hanChars > 0 && hanChars >= words);

  if (shouldUseChinese) {
    const fallbackChars = source.replace(/\s+/g, "").length;
    const charCount = hanChars > 0 ? hanChars : fallbackChars;
    return Math.max(1, Math.ceil(charCount / CHINESE_CHARS_PER_MINUTE));
  }

  return Math.max(1, Math.ceil(words / ENGLISH_WORDS_PER_MINUTE));
}

export function getLocalizedPostTitle(post: BlogPostEntry, locale: Locale) {
  if (getPostLocale(post) === locale) {
    return post.data.title;
  }
  return locale === "en" ? post.data.titleEn ?? post.data.title : post.data.title;
}

export function getLocalizedPostDescription(post: BlogPostEntry, locale: Locale) {
  if (getPostLocale(post) === locale) {
    return post.data.description;
  }
  return locale === "en" ? post.data.descriptionEn ?? post.data.description : post.data.description;
}

export function getLocalizedPostTags(post: BlogPostEntry, locale: Locale) {
  if (getPostLocale(post) === locale) {
    return post.data.tags;
  }
  if (locale === "en" && post.data.tagsEn.length > 0) {
    return post.data.tagsEn;
  }
  return post.data.tags;
}

export function estimateTotalWordCount(posts: BlogPostEntry[], locale: Locale): string {
  let total = 0;
  for (const post of posts) {
    const source = post.body ?? "";
    const hanChars = source.match(CJK_CHAR_REGEX)?.length ?? 0;
    const words = source.trim().split(/\s+/).filter(Boolean).length;
    const isChinese = locale === "zh" || (hanChars > 0 && hanChars >= words);
    total += isChinese ? (hanChars > 0 ? hanChars : source.replace(/\s+/g, "").length) : words;
  }

  if (locale === "zh") {
    return total >= 10000 ? `${(total / 10000).toFixed(1)} 万` : String(total);
  }
  return total >= 1000 ? `${(total / 1000).toFixed(1)}k` : String(total);
}
