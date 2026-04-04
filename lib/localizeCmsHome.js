/**
 * Maps CMS home payload (EN + *Ar fields) into the shape UI components expect for the active locale.
 */

const pick = (en, ar) => {
  if (typeof ar === "string" && ar.trim()) return ar;
  return en ?? "";
};

export function localizeHomeCms(raw, locale = "en") {
  if (!raw || typeof raw !== "object") return raw || {};
  if (locale !== "ar") return raw;

  const hero = raw.hero || {};
  const beforeAfter = raw.beforeAfter || {};
  const map = raw.map || {};

  return {
    ...raw,
    hero: {
      ...hero,
      heading: pick(hero.heading, hero.headingAr),
      accentWord: pick(hero.accentWord, hero.accentWordAr),
      headingSuffix: pick(hero.headingSuffix, hero.headingSuffixAr),
      ctaPrimaryText: pick(hero.ctaPrimaryText, hero.ctaPrimaryTextAr),
      ctaSecondaryText: pick(hero.ctaSecondaryText, hero.ctaSecondaryTextAr),
    },
    pillars: raw.pillars
      ? {
          ...raw.pillars,
          items: (raw.pillars.items || []).map((p) => ({
            ...p,
            title: pick(p.title, p.titleAr),
            description: pick(p.description, p.descriptionAr),
          })),
        }
      : raw.pillars,
    beforeAfter: {
      ...beforeAfter,
      heading: pick(beforeAfter.heading, beforeAfter.headingAr),
      accentWord: pick(beforeAfter.accentWord, beforeAfter.accentWordAr),
      subtitle: pick(beforeAfter.subtitle, beforeAfter.subtitleAr),
      beforeLabel: pick(beforeAfter.beforeLabel, beforeAfter.beforeLabelAr),
      afterLabel: pick(beforeAfter.afterLabel, beforeAfter.afterLabelAr),
    },
    services: raw.services
      ? {
          ...raw.services,
          items: (raw.services.items || []).map((s) => ({
            ...s,
            title: pick(s.title, s.titleAr),
            description: pick(s.description, s.descriptionAr),
          })),
        }
      : raw.services,
    map: {
      ...map,
      title: pick(map.title, map.titleAr),
      addressText: pick(map.addressText, map.addressTextAr),
      buttonText: pick(map.buttonText, map.buttonTextAr),
    },
  };
}
