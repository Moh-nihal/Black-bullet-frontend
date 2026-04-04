const pick = (en, ar) => {
  if (typeof ar === "string" && ar.trim()) return ar;
  return en ?? "";
};

export function localizeServicesCms(raw, locale = "en") {
  if (!raw || typeof raw !== "object") return raw || {};
  if (locale !== "ar") return raw;

  const hero = raw.hero || {};
  const ecu = raw.ecuDetail || {};
  const cta = raw.cta || {};

  return {
    ...raw,
    hero: {
      ...hero,
      label: pick(hero.label, hero.labelAr),
      heading: pick(hero.heading, hero.headingAr),
      accentWord: pick(hero.accentWord, hero.accentWordAr),
      description: pick(hero.description, hero.descriptionAr),
    },
    ecuDetail: {
      ...ecu,
      label: pick(ecu.label, ecu.labelAr),
      heading: pick(ecu.heading, ecu.headingAr),
      para1: pick(ecu.para1, ecu.para1Ar),
      para2: pick(ecu.para2, ecu.para2Ar),
      bookingCtaText: pick(ecu.bookingCtaText, ecu.bookingCtaTextAr),
      features: (ecu.features || []).map((feat) => ({
        ...feat,
        title: pick(feat.title, feat.titleAr),
        desc: pick(feat.desc, feat.descAr),
      })),
    },
    cta: {
      ...cta,
      heading: pick(cta.heading, cta.headingAr),
      accentWord: pick(cta.accentWord, cta.accentWordAr),
      suffix: pick(cta.suffix, cta.suffixAr),
      primaryText: pick(cta.primaryText, cta.primaryTextAr),
      secondaryText: pick(cta.secondaryText, cta.secondaryTextAr),
    },
    servicesGrid: (raw.servicesGrid || []).map((s) => ({
      ...s,
      title: pick(s.title, s.titleAr),
      desc: pick(s.desc, s.descAr),
    })),
  };
}
