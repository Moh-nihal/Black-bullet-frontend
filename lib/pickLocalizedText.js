/**
 * Normalizes a value for display: handles legacy { en, ar } objects from APIs.
 */
export function pickLocalizedText(value, locale = "en") {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && !Array.isArray(value)) {
    const en = typeof value.en === "string" ? value.en : "";
    const ar = typeof value.ar === "string" ? value.ar : "";
    if (locale === "ar" && ar.trim()) return ar;
    return en || ar || "";
  }
  return String(value);
}
