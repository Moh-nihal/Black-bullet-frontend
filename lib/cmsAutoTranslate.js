/**
 * Fills *Ar fields from English source text via /api/translate (same stack as BlogForm).
 */

import { normalizeGalleryCategories } from "@/lib/normalizeGalleryCategories";

async function toAr(text) {
  const s = typeof text === "string" ? text.trim() : "";
  if (!s) return "";
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: s, target: "ar" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Translation failed");
  return json.translatedText || "";
}

function cloneData(data) {
  try {
    return structuredClone(data);
  } catch {
    return JSON.parse(JSON.stringify(data));
  }
}

async function translateHome(d) {
  const out = cloneData(d);
  out.hero ||= {};
  out.beforeAfter ||= {};
  out.pillars ||= { items: [] };
  out.pillars.items ||= [];
  out.services ||= { items: [] };
  out.services.items ||= [];
  out.testimonials ||= [];
  out.map ||= {};
  const h = out.hero;
  const [headingAr, accentWordAr, headingSuffixAr, ctaPrimaryTextAr, ctaSecondaryTextAr] = await Promise.all([
    toAr(h.heading),
    toAr(h.accentWord),
    toAr(h.headingSuffix),
    toAr(h.ctaPrimaryText),
    toAr(h.ctaSecondaryText),
  ]);
  Object.assign(h, { headingAr, accentWordAr, headingSuffixAr, ctaPrimaryTextAr, ctaSecondaryTextAr });

  const ba = out.beforeAfter;
  const [baH, baA, baS, baBeforeL, baAfterL] = await Promise.all([
    toAr(ba.heading),
    toAr(ba.accentWord),
    toAr(ba.subtitle),
    toAr(ba.beforeLabel || ""),
    toAr(ba.afterLabel || ""),
  ]);
  Object.assign(ba, {
    headingAr: baH,
    accentWordAr: baA,
    subtitleAr: baS,
    beforeLabelAr: baBeforeL,
    afterLabelAr: baAfterL,
  });

  out.pillars.items = await Promise.all(
    (out.pillars?.items || []).map(async (item) => ({
      ...item,
      titleAr: await toAr(item.title),
      descriptionAr: await toAr(item.description),
    }))
  );

  out.services.items = await Promise.all(
    (out.services?.items || []).map(async (item) => ({
      ...item,
      titleAr: await toAr(item.title),
      descriptionAr: await toAr(item.description),
    }))
  );

  out.testimonials = await Promise.all(
    (out.testimonials || []).map(async (t) => ({
      ...t,
      quoteAr: await toAr(t.quote),
    }))
  );

  const m = out.map;
  const [mapTitleAr, mapAddrAr, mapBtnAr] = await Promise.all([toAr(m.title), toAr(m.addressText), toAr(m.buttonText)]);
  Object.assign(m, { titleAr: mapTitleAr, addressTextAr: mapAddrAr, buttonTextAr: mapBtnAr });

  return out;
}

async function translateServices(d) {
  const out = cloneData(d);
  out.hero ||= {};
  out.servicesGrid ||= [];
  out.ecuDetail ||= { features: [] };
  out.ecuDetail.features ||= [];
  out.cta ||= {};
  const hero = out.hero;
  const [labelAr, headingAr, accentWordAr, descriptionAr] = await Promise.all([
    toAr(hero.label),
    toAr(hero.heading),
    toAr(hero.accentWord),
    toAr(hero.description),
  ]);
  Object.assign(hero, { labelAr, headingAr, accentWordAr, descriptionAr });

  out.servicesGrid = await Promise.all(
    (out.servicesGrid || []).map(async (s) => ({
      ...s,
      titleAr: await toAr(s.title),
      descAr: await toAr(s.desc || ""),
    }))
  );

  const ecu = out.ecuDetail;
  const [el, eh, ep1, ep2, ebk] = await Promise.all([
    toAr(ecu.label),
    toAr(ecu.heading),
    toAr(ecu.para1),
    toAr(ecu.para2),
    toAr(ecu.bookingCtaText || ""),
  ]);
  Object.assign(ecu, { labelAr: el, headingAr: eh, para1Ar: ep1, para2Ar: ep2, bookingCtaTextAr: ebk });
  ecu.features = await Promise.all(
    (ecu.features || []).map(async (feat) => ({
      ...feat,
      titleAr: await toAr(feat.title),
      descAr: await toAr(feat.desc),
    }))
  );

  const c = out.cta;
  const [ch, ca, cs, cp, cs2] = await Promise.all([
    toAr(c.heading),
    toAr(c.accentWord),
    toAr(c.suffix || ""),
    toAr(c.primaryText),
    toAr(c.secondaryText),
  ]);
  Object.assign(c, { headingAr: ch, accentWordAr: ca, suffixAr: cs, primaryTextAr: cp, secondaryTextAr: cs2 });

  return out;
}

async function translateGallery(d) {
  const out = cloneData(d);
  out.header ||= {};
  out.featured ||= {};
  out.gridItems ||= [];
  out.cta ||= {};
  const hdr = out.header;
  const [hh, ha, hs] = await Promise.all([toAr(hdr.heading), toAr(hdr.accentWord), toAr(hdr.subtitle)]);
  Object.assign(hdr, { headingAr: hh, accentWordAr: ha, subtitleAr: hs });

  const f = out.featured;
  const fv = await Promise.all([
    toAr(f.badge || ""),
    toAr(f.videoLabel),
    toAr(f.title),
    toAr(f.subtitle),
    toAr(f.hpLabel),
    toAr(f.hpDetail),
    toAr(f.torqueLabel),
    toAr(f.torqueDetail),
  ]);
  Object.assign(f, {
    badgeAr: fv[0],
    videoLabelAr: fv[1],
    titleAr: fv[2],
    subtitleAr: fv[3],
    hpLabelAr: fv[4],
    hpDetailAr: fv[5],
    torqueLabelAr: fv[6],
    torqueDetailAr: fv[7],
  });

  out.gridItems = await Promise.all(
    (out.gridItems || []).map(async (item) => ({
      ...item,
      titleAr: await toAr(item.title),
      subtitleAr: await toAr(item.subtitle),
    }))
  );

  const c = out.cta;
  const [ch, ca, cp, cs] = await Promise.all([
    toAr(c.heading),
    toAr(c.accentWord),
    toAr(c.primaryText),
    toAr(c.secondaryText),
  ]);
  Object.assign(c, { headingAr: ch, accentWordAr: ca, primaryTextAr: cp, secondaryTextAr: cs });

  const catRows = normalizeGalleryCategories(out.categories || []);
  out.categories = await Promise.all(
    catRows.map(async (row, i) => {
      const en = row.en || (i === 0 ? "All Projects" : "");
      const arExisting = typeof row.ar === "string" ? row.ar.trim() : "";
      const ar = arExisting || (en ? await toAr(en) : "");
      return { en, ar };
    })
  );

  return out;
}

async function translateBlog(d) {
  const out = cloneData(d);
  out.featuredArticle ||= {};
  out.articleBody ||= {};
  out.relatedArticles ||= [];
  out.categories ||= [];
  out.recentPosts ||= [];
  out.newsletter ||= {};
  const fa = out.featuredArticle;
  const fav = await Promise.all([
    toAr(fa.category),
    toAr(fa.title),
    toAr(fa.accentPhrase),
    toAr(fa.authorTitle),
  ]);
  Object.assign(fa, {
    categoryAr: fav[0],
    titleAr: fav[1],
    accentPhraseAr: fav[2],
    authorTitleAr: fav[3],
  });

  const ab = out.articleBody;
  const abv = await Promise.all([
    toAr(ab.leadQuote),
    toAr(ab.para1),
    toAr(ab.para2),
    toAr(ab.calloutTitle),
    toAr(ab.para3),
  ]);
  Object.assign(ab, {
    leadQuoteAr: abv[0],
    para1Ar: abv[1],
    para2Ar: abv[2],
    calloutTitleAr: abv[3],
    para3Ar: abv[4],
  });

  out.relatedArticles = await Promise.all(
    (out.relatedArticles || []).map(async (a) => ({
      ...a,
      titleAr: await toAr(a.title),
      descAr: await toAr(a.desc),
    }))
  );

  out.categories = await Promise.all(
    (out.categories || []).map(async (cat) => ({
      ...cat,
      nameAr: await toAr(cat.name),
    }))
  );

  out.recentPosts = await Promise.all(
    (out.recentPosts || []).map(async (p) => ({
      ...p,
      titleAr: await toAr(p.title),
    }))
  );

  const n = out.newsletter;
  const [nt, nd] = await Promise.all([toAr(n.title), toAr(n.description)]);
  Object.assign(n, { titleAr: nt, descriptionAr: nd });

  return out;
}

async function translateSettings(d) {
  const out = cloneData(d);
  const [
    seoTitleAr,
    metaDescriptionAr,
    footerTaglineAr,
    copyrightTextAr,
    footerBrandNameAr,
    footerEngineeringTitleAr,
    footerConnectTitleAr,
    footerNewsletterTitleAr,
    footerNewsletterPlaceholderAr,
  ] = await Promise.all([
    toAr(out.seoTitle),
    toAr(out.metaDescription),
    toAr(out.footerTagline),
    toAr(out.copyrightText),
    toAr(out.footerBrandName),
    toAr(out.footerEngineeringTitle),
    toAr(out.footerConnectTitle),
    toAr(out.footerNewsletterTitle),
    toAr(out.footerNewsletterPlaceholder),
  ]);
  Object.assign(out, {
    seoTitleAr,
    metaDescriptionAr,
    footerTaglineAr,
    copyrightTextAr,
    footerBrandNameAr,
    footerEngineeringTitleAr,
    footerConnectTitleAr,
    footerNewsletterTitleAr,
    footerNewsletterPlaceholderAr,
  });

  if (Array.isArray(out.footerEngineeringLinks)) {
    out.footerEngineeringLinks = await Promise.all(
      out.footerEngineeringLinks.map(async (row) => ({
        ...row,
        labelAr: await toAr(row.label),
      }))
    );
  }
  if (Array.isArray(out.footerConnectLinks)) {
    out.footerConnectLinks = await Promise.all(
      out.footerConnectLinks.map(async (row) => ({
        ...row,
        labelAr: await toAr(row.label),
      }))
    );
  }

  return out;
}

/**
 * @param {"home"|"services"|"gallery"|"blog"|"settings"} tab
 * @param {object} data — current CMS state for that tab
 */
export async function applyCmsAutoTranslate(tab, data) {
  switch (tab) {
    case "home":
      return translateHome(data);
    case "services":
      return translateServices(data);
    case "gallery":
      return translateGallery(data);
    case "blog":
      return translateBlog(data);
    case "settings":
      return translateSettings(data);
    default:
      return cloneData(data);
  }
}
