export const SITE_TITLE = "Ink & Interval";
export const SITE_DESCRIPTION_ZH = "一间温暖、安静的个人博客，记录技术、写作与缓慢生长的想法。";
export const SITE_DESCRIPTION_EN = "A warm, quiet personal blog about code, writing, and slow growth.";
export const SITE_DESCRIPTION = SITE_DESCRIPTION_ZH;

export function withBase(path = "/") {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
