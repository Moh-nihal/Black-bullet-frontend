const pick = (en, ar) => {
  if (typeof ar === "string" && ar.trim()) return ar;
  return en ?? "";
};

export function localizeBlogLanding(raw, locale = "en") {
  if (!raw || typeof raw !== "object") return raw || {};
  if (locale !== "ar") return raw;

  const fa = raw.featuredArticle || {};
  const ab = raw.articleBody || {};
  const n = raw.newsletter || {};

  return {
    ...raw,
    featuredArticle: {
      ...fa,
      category: pick(fa.category, fa.categoryAr),
      date: pick(fa.date, fa.dateAr),
      title: pick(fa.title, fa.titleAr),
      accentPhrase: pick(fa.accentPhrase, fa.accentPhraseAr),
      authorTitle: pick(fa.authorTitle, fa.authorTitleAr),
    },
    articleBody: {
      ...ab,
      leadQuote: pick(ab.leadQuote, ab.leadQuoteAr),
      para1: pick(ab.para1, ab.para1Ar),
      para2: pick(ab.para2, ab.para2Ar),
      calloutTitle: pick(ab.calloutTitle, ab.calloutTitleAr),
      para3: pick(ab.para3, ab.para3Ar),
    },
    relatedArticles: (raw.relatedArticles || []).map((a) => ({
      ...a,
      title: pick(a.title, a.titleAr),
      desc: pick(a.desc, a.descAr),
      category: pick(a.category, a.categoryAr),
    })),
    categories: (raw.categories || []).map((c) => ({
      ...c,
      name: pick(c.name, c.nameAr),
    })),
    recentPosts: (raw.recentPosts || []).map((p) => ({
      ...p,
      title: pick(p.title, p.titleAr),
      category: pick(p.category, p.categoryAr),
    })),
    newsletter: {
      ...n,
      title: pick(n.title, n.titleAr),
      description: pick(n.description, n.descriptionAr),
    },
  };
}
