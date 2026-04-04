const pick = (en, ar) => {
  if (typeof ar === "string" && ar.trim()) return ar;
  return en ?? "";
};

export function localizeGalleryCms(raw, locale = "en") {
  if (!raw || typeof raw !== "object") return raw || {};
  if (locale !== "ar") return raw;

  const header = raw.header || {};
  const featured = raw.featured || {};
  const cta = raw.cta || {};

  return {
    ...raw,
    header: {
      ...header,
      heading: pick(header.heading, header.headingAr),
      accentWord: pick(header.accentWord, header.accentWordAr),
      subtitle: pick(header.subtitle, header.subtitleAr),
    },
    featured: {
      ...featured,
      badge: pick(featured.badge, featured.badgeAr),
      videoLabel: pick(featured.videoLabel, featured.videoLabelAr),
      title: pick(featured.title, featured.titleAr),
      subtitle: pick(featured.subtitle, featured.subtitleAr),
      hpLabel: pick(featured.hpLabel, featured.hpLabelAr),
      hpDetail: pick(featured.hpDetail, featured.hpDetailAr),
      torqueLabel: pick(featured.torqueLabel, featured.torqueLabelAr),
      torqueDetail: pick(featured.torqueDetail, featured.torqueDetailAr),
    },
    cta: {
      ...cta,
      heading: pick(cta.heading, cta.headingAr),
      accentWord: pick(cta.accentWord, cta.accentWordAr),
      primaryText: pick(cta.primaryText, cta.primaryTextAr),
      secondaryText: pick(cta.secondaryText, cta.secondaryTextAr),
    },
    gridItems: (raw.gridItems || []).map((item) => ({
      ...item,
      title: pick(item.title, item.titleAr),
      subtitle: pick(item.subtitle, item.subtitleAr),
    })),
  };
}
