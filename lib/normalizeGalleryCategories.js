/** @typedef {{ en: string; ar: string }} GalleryCategoryRow */

/**
 * Normalize CMS gallery categories from legacy string[] or mixed shapes.
 * @param {unknown[]} arr
 * @returns {GalleryCategoryRow[]}
 */
export function normalizeGalleryCategories(arr) {
  const list = Array.isArray(arr) && arr.length > 0 ? arr : [{ en: "All Projects", ar: "" }];
  return list.map((c, i) => {
    if (typeof c === "string") {
      return { en: c || (i === 0 ? "All Projects" : ""), ar: "" };
    }
    if (c && typeof c === "object") {
      return {
        en: typeof c.en === "string" ? c.en : i === 0 ? "All Projects" : "",
        ar: typeof c.ar === "string" ? c.ar : "",
      };
    }
    return { en: i === 0 ? "All Projects" : "", ar: "" };
  });
}

/** English filter key for API + chip matching (prefer EN) */
export function galleryCategoryFilterKey(row) {
  if (!row) return "";
  const en = typeof row.en === "string" ? row.en.trim() : "";
  const ar = typeof row.ar === "string" ? row.ar.trim() : "";
  return en || ar;
}

export function galleryCategoryLabel(row, locale) {
  if (!row) return "";
  const en = typeof row.en === "string" ? row.en : "";
  const ar = typeof row.ar === "string" ? row.ar : "";
  if (locale === "ar" && ar.trim()) return ar;
  return en || ar;
}
