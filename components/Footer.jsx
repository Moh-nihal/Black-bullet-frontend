"use client";

import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url, { cache: "no-store" }).then((r) => r.json());

function pick(loc, en, ar) {
  if (loc === "ar" && ar != null && String(ar).trim()) return String(ar).trim();
  return en != null ? String(en).trim() : "";
}

/** @param {string} href path (/services), full URL, or # */
function resolveFooterHref(href, loc) {
  if (href == null || href === "") return "#";
  const h = String(href).trim();
  if (h === "#") return "#";
  if (/^(https?:|mailto:|tel:)/i.test(h)) return h;
  const path = h.startsWith("/") ? h : `/${h}`;
  return `/${loc}${path}`;
}

function FooterLink({ href, loc, children, className }) {
  const resolved = resolveFooterHref(href, loc);
  const isExternal = /^(https?:|mailto:|tel:)/i.test(resolved);
  if (resolved === "#") {
    return <span className={className}>{children}</span>;
  }
  if (isExternal) {
    return (
      <a href={resolved} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={resolved} className={className}>
      {children}
    </Link>
  );
}

export default function Footer({ locale = "en" }) {
  const loc = locale === "ar" ? "ar" : "en";

  const { data: settingsRes } = useSWR("/api/public/content/settings", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const s = settingsRes?.data || {};

  const { data: servicesRes } = useSWR(`/api/public/services?lang=${loc}&limit=6`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const dynamicServices = servicesRes?.data || [];

  const tagline = pick(loc, s.footerTagline, s.footerTaglineAr);
  const copyright = pick(loc, s.copyrightText, s.copyrightTextAr);
  const brandName = pick(loc, s.footerBrandName, s.footerBrandNameAr);

  const engTitle = pick(loc, s.footerEngineeringTitle, s.footerEngineeringTitleAr);
  const connTitle = pick(loc, s.footerConnectTitle, s.footerConnectTitleAr);
  const subTitle = pick(loc, s.footerNewsletterTitle, s.footerNewsletterTitleAr);
  const emailPh = pick(loc, s.footerNewsletterPlaceholder, s.footerNewsletterPlaceholderAr);

  const engLinksFromSettings = Array.isArray(s.footerEngineeringLinks)
    ? s.footerEngineeringLinks.filter((l) => l && (String(l.label || "").trim() || String(l.labelAr || "").trim()))
    : [];

  const engLinks = dynamicServices.length > 0 
    ? dynamicServices.map(svc => ({
        label: svc.title,
        labelAr: svc.titleAr, // or just use label since svc.title IS localized
        href: `/services/${svc.slug || svc._id}`
      }))
    : engLinksFromSettings;

  const connLinks = Array.isArray(s.footerConnectLinks)
    ? s.footerConnectLinks.filter((l) => l && (String(l.label || "").trim() || String(l.labelAr || "").trim()))
    : [];

  const linkClass =
    "font-body text-[clamp(12px,1vw,14px)] text-outline-variant hover:text-primary transition-all underline-offset-4 hover:underline";

  const shareUrl = typeof s.footerShareUrl === "string" ? s.footerShareUrl.trim() : "";
  const locationUrl = typeof s.footerLocationUrl === "string" ? s.footerLocationUrl.trim() : "";

  const hasBrandCol = Boolean(brandName || tagline);
  const hasEngCol = engLinks.length > 0;
  const hasConnCol = connLinks.length > 0;
  const hasNewsCol = Boolean(subTitle || emailPh);

  const hasTop = hasBrandCol || hasEngCol || hasConnCol || hasNewsCol;
  const colCount = [hasBrandCol, hasEngCol, hasConnCol, hasNewsCol].filter(Boolean).length;
  const gridClass =
    colCount <= 1
      ? "grid-cols-1"
      : colCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : colCount === 3
          ? "grid-cols-1 md:grid-cols-3"
          : "grid-cols-1 md:grid-cols-4";

  return (
    <footer className="bg-black w-full border-t border-[#262626]">
      <div className="max-w-[1200px] mx-auto w-full">
        {hasTop ? (
        <div className={`grid ${gridClass} gap-8 px-4 lg:px-6 py-12 w-full`}>
          {hasBrandCol && (
            <div className="md:col-span-1">
              {brandName ? (
                <Link
                  href={`/${loc}`}
                  className="font-headline text-xl font-black text-white mb-6 block"
                >
                  {brandName}
                </Link>
              ) : null}
              {tagline ? (
                <p className="font-body text-[clamp(12px,1vw,14px)] text-on-surface-variant leading-relaxed">
                  {tagline}
                </p>
              ) : null}
            </div>
          )}

          {hasEngCol && (
            <div>
              {engTitle ? (
                <h5 className="font-headline font-bold text-white uppercase text-sm mb-6 tracking-widest">
                  {engTitle}
                </h5>
              ) : null}
              <ul className="space-y-4">
                {engLinks.map((item, i) => (
                  <li key={`${item.label}-${i}`}>
                    <FooterLink href={item.href} loc={loc} className={linkClass}>
                      {pick(loc, item.label, item.labelAr)}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasConnCol && (
            <div>
              {connTitle ? (
                <h5 className="font-headline font-bold text-white uppercase text-sm mb-6 tracking-widest">
                  {connTitle}
                </h5>
              ) : null}
              <ul className="space-y-4">
                {connLinks.map((item, i) => (
                  <li key={`${item.label}-${i}`}>
                    <FooterLink href={item.href} loc={loc} className={linkClass}>
                      {pick(loc, item.label, item.labelAr)}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasNewsCol && (
            <div>
              {subTitle ? (
                <h5 className="font-headline font-bold text-white uppercase text-sm mb-6 tracking-widest">
                  {subTitle}
                </h5>
              ) : null}
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="bg-white/10 border border-white/20 text-white px-4 py-2 w-full font-body focus:ring-1 focus:ring-primary placeholder:text-white/40"
                  placeholder={emailPh}
                  type="email"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary-fixed px-4 flex items-center justify-center hover:brightness-110 transition-all"
                  aria-label="Subscribe"
                >
                  <span className="material-symbols-outlined text-[1.2rem]">send</span>
                </button>
              </form>
            </div>
          )}
        </div>
        ) : null}

        {(copyright || shareUrl || locationUrl) ? (
        <div className="px-4 lg:px-6 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          {copyright ? (
            <div className="font-body text-[clamp(10px,0.8vw,12px)] text-outline-variant text-center md:text-start">
              {copyright}
            </div>
          ) : (
            <div />
          )}
          {(shareUrl || locationUrl) && (
            <div className="flex gap-6">
              {shareUrl ? (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-outline-variant hover:text-primary transition-all"
                  aria-label="Share"
                >
                  <span className="material-symbols-outlined text-[1.2rem]">share</span>
                </a>
              ) : null}
              {locationUrl ? (
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-outline-variant hover:text-primary transition-all"
                  aria-label="Location"
                >
                  <span className="material-symbols-outlined text-[1.2rem]">location_on</span>
                </a>
              ) : null}
            </div>
          )}
        </div>
        ) : null}
      </div>
    </footer>
  );
}
