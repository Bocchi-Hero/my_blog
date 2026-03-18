import { withBase } from "./consts";

export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const sharedCopy = {
  zh: {
    nav: {
      home: "首页",
      blog: "文章",
      about: "关于",
    },
    tagline: "Quietly published",
    languageLabel: "语言切换",
    footerNote: "一个适合代码、写作与缓慢思考停留的温暖角落。",
  },
  en: {
    nav: {
      home: "Home",
      blog: "Posts",
      about: "About",
    },
    tagline: "Quietly published",
    languageLabel: "Language switch",
    footerNote: "A warm, quiet corner for code, writing, and slow thinking.",
  },
} as const;

function normalizePath(path = "/") {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") {
    return "/";
  }
  return `${withLeadingSlash.replace(/\/+$/, "")}/`;
}

export function getPathWithoutBase(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || "/";
  }
  return pathname || "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const path = getPathWithoutBase(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "zh";
}

export function stripLocaleFromPathname(pathname: string) {
  const normalized = normalizePath(getPathWithoutBase(pathname));
  if (normalized === "/en/") {
    return "/";
  }
  if (normalized.startsWith("/en/")) {
    return `/${normalized.slice(4)}`;
  }
  return normalized;
}

export function localePath(locale: Locale, path = "/") {
  const normalized = normalizePath(path);
  if (locale === "en") {
    return withBase(normalized === "/" ? "/en/" : `/en${normalized}`);
  }
  return withBase(normalized);
}

export function switchLocalePath(pathname: string, locale: Locale) {
  return localePath(locale, stripLocaleFromPathname(pathname));
}
