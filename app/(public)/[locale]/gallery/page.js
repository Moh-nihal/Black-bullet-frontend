import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import FeaturedBuildBeforeAfter from "@/components/FeaturedBuildBeforeAfter";
import FeaturedBuildVideoCard from "@/components/FeaturedBuildVideoCard";
import { getGalleryContent } from "@/lib/api/content";
import { localizeGalleryCms } from "@/lib/localizeCmsGallery";
import { withLocalePrefix } from "@/lib/localePath";

export const metadata = {
  title: "Gallery | BLACK BULLET GARAGE",
  description:
    "Witness the evolution of performance. Explore our most prestigious Dubai builds — from bespoke aerodynamic kits to radical engine remapping.",
};

export default async function GalleryPage({ params }) {
  const { locale: localeParam } = await params;
  const locale = localeParam === "ar" ? "ar" : "en";

  const contentRes = await getGalleryContent(locale);
  const cmsData = localizeGalleryCms(contentRes?.data || {}, locale);
  const header = cmsData.header || {};
  const featured = cmsData.featured || {};
  const cta = cmsData.cta || {};

  const beforeSrc = featured.beforeImage;
  const afterSrc = featured.afterImage;
  const hasFeaturedSlider = !!(beforeSrc && afterSrc);

  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 px-4 lg:px-6 max-w-[1200px] mx-auto">
      {(header.heading || header.accentWord || header.subtitle) && (
        <header className="mb-12 md:mb-16">
          {(header.heading || header.accentWord) && (
            <h1 className="font-headline text-[clamp(48px,6vw,96px)] font-black uppercase tracking-tighter mb-4 leading-none">
              {header.heading ? `${header.heading} ` : null}
              {header.accentWord ? <span className="text-primary">{header.accentWord}</span> : null}
            </h1>
          )}
          {header.subtitle ? (
            <p className="font-body text-on-surface-variant max-w-2xl text-[clamp(14px,1.2vw,18px)]">{header.subtitle}</p>
          ) : null}
        </header>
      )}

      {(hasFeaturedSlider ||
        featured.badge ||
        featured.title ||
        featured.subtitle ||
        featured.hpLabel ||
        featured.hpValue ||
        featured.hpDetail ||
        featured.torqueLabel ||
        featured.torqueValue ||
        featured.torqueDetail ||
        featured.videoSrc) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-24">
          {(hasFeaturedSlider || featured.badge || featured.title || featured.subtitle) && (
            <div className={`relative ${hasFeaturedSlider ? "" : "min-h-[280px] bg-surface-container-highest"}`}>
              {hasFeaturedSlider ? (
                <FeaturedBuildBeforeAfter
                  beforeSrc={beforeSrc}
                  afterSrc={afterSrc}
                  beforeAlt={featured.title ? `${featured.title} before` : ""}
                  afterAlt={featured.title ? `${featured.title} after` : ""}
                />
              ) : null}
              {featured.badge ? (
                <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-primary px-3 py-1 font-label text-[10px] font-black uppercase tracking-widest text-on-primary-fixed pointer-events-none z-10">
                  {featured.badge}
                </div>
              ) : null}
              {(featured.title || featured.subtitle) && (
                <div
                  className={`pointer-events-none z-10 ${
                    hasFeaturedSlider ? "absolute bottom-6 md:bottom-8 left-6 md:left-8" : "absolute bottom-6 md:bottom-8 left-6 md:left-8"
                  }`}
                >
                  {featured.title ? (
                    <h3 className="font-headline text-[clamp(24px,2.5vw,36px)] font-black italic uppercase tracking-tighter text-black">
                      {featured.title}
                    </h3>
                  ) : null}
                  {featured.subtitle ? (
                    <p className="text-on-surface-variant text-[clamp(12px,1vw,14px)] font-medium tracking-wide">{featured.subtitle}</p>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {(featured.hpLabel || featured.hpValue || featured.hpDetail) && (
              <div className="bg-surface-container-high p-6 md:p-8 flex flex-col justify-center border-l-4 border-primary">
                {featured.hpLabel ? (
                  <span className="font-label text-primary font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4">
                    {featured.hpLabel}
                  </span>
                ) : null}
                {featured.hpValue ? (
                  <div className="text-[clamp(36px,4vw,64px)] font-headline font-black italic mb-1 md:mb-2 leading-none">
                    {featured.hpValue}
                    <span className="text-[clamp(16px,2vw,24px)] italic font-normal text-on-surface-variant ml-2">HP</span>
                  </div>
                ) : null}
                {featured.hpDetail ? (
                  <p className="text-on-surface-variant text-[10px] md:text-xs uppercase font-bold tracking-widest mt-2">{featured.hpDetail}</p>
                ) : null}
              </div>
            )}
            {(featured.torqueLabel || featured.torqueValue || featured.torqueDetail) && (
              <div className="bg-surface-container-high p-6 md:p-8 flex flex-col justify-center border-l-4 border-tertiary">
                {featured.torqueLabel ? (
                  <span className="font-label text-tertiary font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4">
                    {featured.torqueLabel}
                  </span>
                ) : null}
                {featured.torqueValue ? (
                  <div className="text-[clamp(36px,4vw,64px)] font-headline font-black italic mb-1 md:mb-2 leading-none">
                    {featured.torqueValue}
                    <span className="text-[clamp(16px,2vw,24px)] italic font-normal text-on-surface-variant ml-2">NM</span>
                  </div>
                ) : null}
                {featured.torqueDetail ? (
                  <p className="text-on-surface-variant text-[10px] md:text-xs uppercase font-bold tracking-widest mt-2">{featured.torqueDetail}</p>
                ) : null}
              </div>
            )}

            {featured.videoSrc ? (
              <FeaturedBuildVideoCard src={featured.videoSrc} label={featured.videoLabel || ""} />
            ) : null}
          </div>
        </section>
      )}

      <GalleryGrid categories={cmsData.categories} items={cmsData.gridItems} locale={locale} />

      {(cta.heading || cta.accentWord || cta.primaryText || cta.secondaryText) && (
        <section className="mt-16 md:mt-24 py-12 md:py-16 bg-surface-container-low flex flex-col items-center text-center px-4 border-t border-black/10 rounded-none max-w-full">
          {(cta.heading || cta.accentWord) && (
            <h2 className="font-headline text-[clamp(28px,4vw,48px)] font-black italic uppercase tracking-tighter mb-8 max-w-3xl">
              {cta.heading ? `${cta.heading} ` : null}
              {cta.accentWord ? <span className="text-primary">{cta.accentWord}</span> : null}
            </h2>
          )}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
            {cta.primaryText ? (
              <Link
                href={withLocalePrefix(cta.primaryLink || "/booking", locale)}
                className="bg-primary text-on-primary-fixed px-8 py-4 font-label font-black uppercase tracking-[0.2em] text-[clamp(12px,1vw,14px)] hover:translate-y-[-4px] transition-transform inline-block w-full md:w-auto"
              >
                {cta.primaryText}
              </Link>
            ) : null}
            {cta.secondaryText ? (
              <Link
                href={withLocalePrefix(cta.secondaryLink || "/services", locale)}
                className="bg-transparent border border-outline px-8 py-4 font-label font-black uppercase tracking-[0.2em] text-[clamp(12px,1vw,14px)] hover:bg-white hover:text-black transition-all inline-block w-full md:w-auto"
              >
                {cta.secondaryText}
              </Link>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
