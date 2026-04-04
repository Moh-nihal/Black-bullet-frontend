import Image from "next/image";
import Link from "next/link";

import { getServicesContent } from "@/lib/api/content";
import { localizeServicesCms } from "@/lib/localizeCmsServices";
import { pickLocalizedText } from "@/lib/pickLocalizedText";
import { withLocalePrefix } from "@/lib/localePath";

export const metadata = {
  title: "Services | Black Bullet Garage Performance",
  description:
    "ECU programming, advanced diagnostics, mechanical repair, electrical systems, performance tuning, and custom exhaust solutions in Dubai.",
};

async function getServices(locale = "en") {
  try {
    const qs = new URLSearchParams({ limit: "50", locale: locale === "ar" ? "ar" : "en" });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/services?${qs}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

export default async function ServicesPage({ params }) {
  const { locale: localeParam } = await params;
  const locale = localeParam === "ar" ? "ar" : "en";

  const [apiServices, contentRes] = await Promise.all([getServices(locale), getServicesContent(locale)]);

  const cmsData = localizeServicesCms(contentRes?.data || {}, locale);
  const ecu = cmsData.ecuDetail || {};
  const cta = cmsData.cta || {};

  const services = apiServices.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: pickLocalizedText(s.title, locale),
    img: s.images?.[0] || "",
    alt: pickLocalizedText(s.title, locale),
    desc: pickLocalizedText(s.shortDesc || s.description, locale),
    active: i === 0,
    slug: s.slug || s._id,
    isRemote: !!(s.images?.[0]),
  }));

  const detailService = apiServices.length > 0 ? apiServices[0] : null;
  const detailTitle = detailService ? pickLocalizedText(detailService.title, locale) : "";
  const detailDesc = detailService ? pickLocalizedText(detailService.description || detailService.shortDesc, locale) : "";

  const featureList = Array.isArray(ecu.features) ? ecu.features : [];

  const showEcuSection =
    !!(
      ecu.label ||
      ecu.heading ||
      ecu.para1 ||
      ecu.para2 ||
      ecu.bookingCtaText ||
      featureList.length ||
      detailTitle ||
      detailDesc ||
      detailService?.images?.[0]
    );

  return (
    <>
      <section className="px-4 lg:px-6 pt-28 md:pt-32 pb-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          {cmsData?.hero?.label ? (
            <span className="font-label text-primary font-bold tracking-[0.2em] uppercase text-sm block mb-4">
              {cmsData.hero.label}
            </span>
          ) : null}
          {(cmsData?.hero?.heading || cmsData?.hero?.accentWord) && (
            <h1 className="font-headline text-[clamp(40px,5vw,64px)] font-black tracking-widest uppercase mb-6 leading-[1.1] text-black">
              {cmsData?.hero?.heading ? `${cmsData.hero.heading} ` : null}
              <br className="hidden md:block" />
              {cmsData?.hero?.accentWord ? (
                <span className="text-primary">{cmsData.hero.accentWord}</span>
              ) : null}
            </h1>
          )}
          {cmsData?.hero?.description ? (
            <p className="max-w-2xl text-on-surface-variant text-[clamp(14px,1.2vw,18px)] leading-relaxed whitespace-pre-line">
              {cmsData.hero.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-4 lg:px-6 py-10 md:py-16 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {services.map((s) => (
                <Link
                  href={`/${locale}/services/${s.slug}`}
                  key={s.num}
                  className="group relative aspect-[4/5] bg-black overflow-hidden border border-black/5 cursor-pointer"
                >
                  {s.img ? (
                    <Image
                      src={s.img}
                      alt={s.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={!!s.isRemote}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                    <span
                      className={`font-label text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-2 block transition-colors ${s.active ? "text-primary" : "text-on-surface-variant group-hover:text-primary"}`}
                    >
                      {`Service ${s.num}`}
                    </span>
                    <h3 className="font-headline text-[clamp(18px,2vw,24px)] font-bold uppercase mb-4 text-white">{s.title}</h3>
                    <div
                      className={`h-1 w-12 group-hover:w-full transition-all duration-500 ${s.active ? "bg-primary" : "bg-white group-hover:bg-primary"}`}
                    />
                    {s.desc ? (
                      <p className="mt-4 text-on-surface-variant text-[clamp(12px,1vw,14px)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                        {s.desc}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {showEcuSection ? (
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-20 bg-primary" />
                {ecu.label ? (
                  <span className="font-label text-primary font-bold tracking-widest uppercase text-sm">{ecu.label}</span>
                ) : null}
              </div>
              {(ecu.heading || detailTitle) && (
                <h2 className="font-headline text-[clamp(28px,4vw,48px)] font-black uppercase mb-8 leading-tight">
                  {ecu.heading || detailTitle}
                </h2>
              )}
              <div className="space-y-6 text-on-surface-variant text-[clamp(14px,1.2vw,18px)] leading-relaxed">
                {ecu.para1 ? <p>{ecu.para1}</p> : null}
                {ecu.para2 ? <p>{ecu.para2}</p> : null}
                {!ecu.para1 && !ecu.para2 && detailDesc ? <p>{detailDesc}</p> : null}
              </div>
              {featureList.length > 0 ? (
                <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {featureList.map((feat, fi) => (
                    <div key={fi} className="bg-surface-container-low p-6 border-l-4 border-primary">
                      {feat.title ? (
                        <h4 className="font-label font-bold text-black uppercase text-sm mb-2 tracking-wider">{feat.title}</h4>
                      ) : null}
                      {feat.desc ? <p className="text-on-surface-variant text-sm">{feat.desc}</p> : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {ecu.bookingCtaText ? (
                <div className="mt-10 md:mt-12">
                  <Link
                    href={withLocalePrefix("/booking", locale)}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-tr from-primary-dim to-primary text-on-primary-fixed font-headline font-black uppercase tracking-[0.15em] text-sm md:text-base hover:brightness-110 transition-all flex items-center justify-center gap-3 inline-flex"
                  >
                    {ecu.bookingCtaText}
                    <span className="material-symbols-outlined text-[1.2rem]">trending_flat</span>
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              {detailService?.images?.[0] ? (
                <div className="relative aspect-square bg-surface-container">
                  <Image
                    src={detailService.images[0]}
                    alt={detailTitle || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {(cta.heading || cta.accentWord || cta.suffix || cta.primaryText || cta.secondaryText) && (
        <section className="py-16 md:py-20 bg-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-6">
            {(cta.heading || cta.accentWord || cta.suffix) && (
              <h2 className="font-headline text-[clamp(32px,5vw,64px)] font-black uppercase mb-6 md:mb-8 leading-tight">
                {cta.heading ? `${cta.heading} ` : null}
                {cta.accentWord ? <span className="text-glow text-primary">{cta.accentWord}</span> : null}
                {cta.suffix ? ` ${cta.suffix}` : null}
              </h2>
            )}
            <div className="flex flex-col md:flex-row justify-center gap-4 w-full md:w-auto px-4">
              {cta.primaryText ? (
                <Link
                  href={withLocalePrefix(cta.primaryLink || "/booking", locale)}
                  className="bg-primary text-on-primary-fixed px-8 py-4 font-headline font-bold uppercase tracking-[0.2em] text-[clamp(12px,1vw,14px)] hover:scale-105 transition-transform inline-block w-full md:w-auto"
                >
                  {cta.primaryText}
                </Link>
              ) : null}
              {cta.secondaryText ? (
                <Link
                  href={withLocalePrefix(cta.secondaryLink || "/services", locale)}
                  className="border border-outline px-8 py-4 font-headline font-bold uppercase tracking-[0.2em] text-[clamp(12px,1vw,14px)] hover:bg-surface-container-highest transition-colors inline-block w-full md:w-auto"
                >
                  {cta.secondaryText}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
