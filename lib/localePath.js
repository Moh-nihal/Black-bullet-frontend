/** Prefix internal paths with /en or /ar when missing (for Link href from CMS). */
export function withLocalePrefix(href, locale) {
  const loc = locale === "ar" ? "ar" : "en";
  const raw = typeof href === "string" ? href.trim() : "";
  if (!raw) return `/${loc}/booking`;
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
  if (raw.startsWith("/en/") || raw.startsWith("/ar/")) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `/${loc}${path}`;
}
