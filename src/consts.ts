export const SITE_TITLE = "Bocchi_Home";
export const AUTHOR_NAME = "Bocchi_Hero";
export const GITHUB_URL = "https://github.com/Bocchi-Hero";
export const BILIBILI_URL = "https://space.bilibili.com/1658112139";
export const AVATAR_PATH = "/avatar.svg";

export const SITE_DESCRIPTION_ZH = "Bocchi_Hero 的个人博客，记录技术、写作与缓慢生长的想法。";
export const SITE_DESCRIPTION_EN = "Bocchi_Hero's personal blog about code, writing, and slow growth.";
export const SITE_DESCRIPTION = SITE_DESCRIPTION_ZH;

export function withBase(path = "/") {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
