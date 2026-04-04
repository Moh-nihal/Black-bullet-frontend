import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import TestimonialCard from "@/components/TestimonialCard";
import Image from "next/image";
import Link from "next/link";
import { getHomeContent } from "@/lib/api/content";
import { getGoogleReviews } from "@/lib/api/reviews";
import { localizeHomeCms } from "@/lib/localizeCmsHome";
import { pickLocalizedText } from "@/lib/pickLocalizedText";

export const metadata = {
  title: "Black Bullet Garage Performance | Dubai",
  description:
    "The pinnacle of performance tuning and aesthetic restoration in Dubai. ECU remapping, detailing, PPF, and bespoke automotive engineering.",
};

function PillarsSection({ data }) {
  const pillars = Array.isArray(data) ? data : [];
  if (pillars.length === 0) return null;

  const getGridClass = (len) => {
    if (len === 1) return "md:grid-cols-1";
    if (len === 2) return "md:grid-cols-2";
    if (len === 4) return "md:grid-cols-2 lg:grid-cols-4";
    return "md:grid-cols-3";
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className={`grid grid-cols-1 gap-6 md:gap-0 md:border border-black/5 ${getGridClass(pillars.length)}`}>
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`p-8 md:p-12 bg-white md:border-r md:border-b border-black/5 hover:bg-surface-container-low transition-colors group`}
            >
              <span className="material-symbols-outlined text-primary text-[clamp(32px,3vw,48px)] mb-6 md:mb-8 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {p.icon}
              </span>
              <h3 className="font-headline font-bold text-[clamp(18px,1.5vw,24px)] mb-4 uppercase tracking-tight text-black min-h-[3em] flex items-start">
                {p.title}
              </h3>
              <p className="text-on-surface-variant font-body leading-relaxed text-[clamp(14px,1.2vw,18px)]">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapSection({ data }) {
  if (!data) return null;
  const hasContent = !!(data.title || data.addressText || data.buttonText || data.mapsLink || data.backgroundImage);
  if (!hasContent) return null;

  return (
    <section className="h-[350px] md:h-[500px] w-full relative overflow-hidden group">
      <div className="absolute inset-0 z-0">
        {data.backgroundImage ? (
          <Image
            src={data.backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized={typeof data.backgroundImage === "string" && data.backgroundImage.startsWith("http")}
          />
        ) : (
          <div className="absolute inset-0 bg-surface-container-highest" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="bg-white p-8 md:p-12 text-center max-w-lg mx-auto w-full shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
          {data.title ? (
            <h3 className="font-headline font-black text-[clamp(24px,2.5vw,36px)] mb-4 uppercase tracking-tighter text-black">
              {data.title}
            </h3>
          ) : null}
          {data.addressText ? (
            <p className="font-body text-on-surface-variant mb-6 md:mb-8 text-[clamp(14px,1.2vw,18px)] whitespace-pre-line">
              {data.addressText}
            </p>
          ) : null}
          {data.buttonText && data.mapsLink ? (
            <Link
              href={data.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="kinetic-gradient text-white font-headline font-bold px-8 py-3.5 uppercase tracking-widest text-sm hover:brightness-110 transition-all inline-block shadow-[0_4px_15px_rgba(220,0,0,0.3)]"
            >
              {data.buttonText}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

async function getServices(locale = "en") {
  try {
    const qs = new URLSearchParams({ limit: "6", locale: locale === "ar" ? "ar" : "en" });
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

export default async function HomePage({ params }) {
  const { locale: localeParam } = await params;
  const locale = localeParam === "ar" ? "ar" : "en";

  const [contentRes, reviewsRes, apiServices] = await Promise.all([
    getHomeContent(locale),
    getGoogleReviews(),
    getServices(locale),
  ]);

  const cmsData = localizeHomeCms(contentRes?.data || {}, locale);

  const dynamicServicesMapped =
    apiServices.length > 0
      ? apiServices.map((s) => ({
          title: pickLocalizedText(s.title, locale),
          description: pickLocalizedText(s.shortDesc || s.description, locale),
          slug: s.slug || s._id,
          icon: s.icon || "build",
        }))
      : cmsData.services?.items;

  return (
    <>
      <Hero data={cmsData.hero} locale={locale} />
      <PillarsSection data={cmsData.pillars?.items} />
      <BeforeAfterSlider data={cmsData.beforeAfter} />
      <ServiceCard data={dynamicServicesMapped} locale={locale} />
      <TestimonialCard reviewsData={reviewsRes} />
      <MapSection data={cmsData.map} />
    </>
  );
}
