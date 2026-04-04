import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceDetailHero from "@/components/ServiceDetailHero";
import ServiceProcess from "@/components/ServiceProcess";
import RelatedServices from "@/components/RelatedServices";
import GalleryVideoTile from "@/components/GalleryVideoTile";
import { pickLocalizedText } from "@/lib/pickLocalizedText";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function getApiService(slug, locale = "en") {
  const localeQs = `locale=${encodeURIComponent(locale === "ar" ? "ar" : "en")}`;
  try {
    const res = await fetch(
      `${API_URL}/api/public/services/${encodeURIComponent(slug)}?${localeQs}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function getApiRelatedServices(currentSlug, locale = "en") {
  const localeQs = `limit=5&locale=${encodeURIComponent(locale === "ar" ? "ar" : "en")}`;
  try {
    const res = await fetch(`${API_URL}/api/public/services?${localeQs}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data || []).filter((s) => s.slug !== currentSlug).slice(0, 2);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug, locale: loc } = await params;
  const locale = loc === "ar" ? "ar" : "en";
  const apiService = await getApiService(slug, locale);

  const title = pickLocalizedText(apiService?.title, locale);
  const description = pickLocalizedText(apiService?.shortDesc || apiService?.description, locale);

  if (!title) return {};

  return {
    title: `${title} | BLACK BULLET GARAGE`,
    description: description || undefined,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug, locale: locParam } = await params;
  const locale = locParam === "ar" ? "ar" : "en";

  const apiService = await getApiService(slug, locale);
  if (!apiService) {
    notFound();
  }

  const apiRelated = await getApiRelatedServices(slug, locale);

  const titleDisplay = pickLocalizedText(apiService.title, locale);
  const descRaw = pickLocalizedText(apiService.description || apiService.shortDesc, locale);
  const paragraphs = descRaw
    ? descRaw
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const words = titleDisplay.trim().split(/\s+/).filter(Boolean);
  const heroHeadline = locale === "ar" || words.length <= 1 ? titleDisplay : words[0];
  const heroAccent = locale === "ar" || words.length <= 1 ? "" : words.slice(1).join(" ");

  const service = {
    title: titleDisplay,
    heroHeadline,
    heroAccent,
    heroTag: pickLocalizedText(apiService.heroTag, locale),
    heroImage: apiService.images?.[0] || "",
    heroDescription: pickLocalizedText(apiService.shortDesc || apiService.description, locale),
    heroCTA: pickLocalizedText(apiService.buttonName, locale),
    descriptionTitle: titleDisplay,
    descriptionParagraphs: paragraphs.length ? paragraphs : descRaw ? [descRaw] : [],
    descriptionImage: apiService.images?.[1] || apiService.images?.[0] || "",
    descriptionImageAlt: titleDisplay,
    stats:
      Array.isArray(apiService.stats) && apiService.stats.length > 0
        ? apiService.stats.map((st) => ({
            label: pickLocalizedText(st.label, locale),
            value: pickLocalizedText(st.value, locale),
          }))
        : [],
    processTitle: pickLocalizedText(apiService.processTitle, locale),
    processSteps:
      Array.isArray(apiService.processSteps) && apiService.processSteps.length > 0
        ? apiService.processSteps.map((f, i) => ({
            num: `0${i + 1}`,
            title: pickLocalizedText(f.title, locale),
            desc: pickLocalizedText(f.desc, locale),
            icon: "build",
          }))
        : [],
    relatedServices: apiRelated.map((s) => ({
      title: pickLocalizedText(s.title, locale),
      desc: pickLocalizedText(s.shortDesc || s.description, locale),
      icon: "auto_fix_high",
      link: `/${locale}/services/${s.slug}`,
      cta: pickLocalizedText(s.buttonName, locale),
    })),
    ctaTitle: pickLocalizedText(apiService.ctaTitle, locale),
    ctaAccent: pickLocalizedText(apiService.ctaAccent, locale),
    ctaDescription: pickLocalizedText(apiService.ctaDescription, locale),
    ctaButton: pickLocalizedText(apiService.ctaButton || apiService.buttonName, locale),
    isRemote: !!(apiService.images && apiService.images.length > 0),
    galleryImages: apiService.images?.slice(2) || [],
  };

  const showDescriptionBlock =
    (service.descriptionParagraphs && service.descriptionParagraphs.length > 0) || !!service.descriptionImage;
  const showBottomCta = !!(service.ctaTitle || service.ctaAccent || service.ctaDescription || service.ctaButton);

  return (
    <>
      <ServiceDetailHero service={service} locale={locale} />

      {showDescriptionBlock ? (
        <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="space-y-8">
              {service.descriptionTitle ? (
                <h2 className="font-headline font-bold text-3xl md:text-4xl text-black uppercase tracking-tight">
                  {service.descriptionTitle}
                </h2>
              ) : null}
              <div className="space-y-4 text-on-surface-variant font-body leading-loose whitespace-pre-line">
                {service.descriptionParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {service.stats && service.stats.length > 0 ? (
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-outline-variant/20">
                  {service.stats.map((stat) => (
                    <div key={String(stat.label) + String(stat.value)}>
                      <div className="text-primary font-headline font-black text-2xl md:text-3xl">{stat.value}</div>
                      <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {service.descriptionImage ? (
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                {typeof service.descriptionImage === "string" && service.descriptionImage.match(/\.(mp4|webm|mov)(\?|#|$)/i) ? (
                  <video src={service.descriptionImage} className="relative z-10 w-full grayscale contrast-125 border border-outline-variant/10 object-cover" autoPlay muted loop playsInline />
                ) : (
                  <Image
                    src={service.descriptionImage}
                    alt={service.descriptionImageAlt || ""}
                    width={800}
                    height={600}
                    className="relative z-10 w-full grayscale contrast-125 border border-outline-variant/10 object-cover"
                    unoptimized={service.isRemote}
                  />
                )}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {service.galleryImages && service.galleryImages.length > 0 ? (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-headline font-bold text-2xl md:text-3xl text-black uppercase tracking-tight mb-12 text-center">
              {locale === "ar" ? "معرض الخدمة" : "Service Gallery"}
            </h3>
            <section className="masonry-grid w-full">
              {service.galleryImages.map((img, i) => {
                const isVideo = typeof img === "string" && img.match(/\.(mp4|webm|mov)(\?|#|$)/i);
                
                const masonryClasses = [
                  "masonry-item-tall",
                  "masonry-item-square",
                  "masonry-item-wide",
                  "masonry-item-square",
                  "masonry-item-tall",
                  "masonry-item-square",
                  "masonry-item-wide",
                ];
                const className = masonryClasses[i % masonryClasses.length];

                return (
                  <div key={i} className={`${className} relative overflow-hidden bg-surface-container group`}>
                    {isVideo ? (
                      <GalleryVideoTile src={img} />
                    ) : (
                      <>
                        <Image
                          src={img}
                          alt={`${service.title} - Gallery Image ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized={service.isRemote}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </>
                    )}
                  </div>
                );
              })}
            </section>
          </div>
        </section>
      ) : null}

      {service.processSteps && service.processSteps.length > 0 ? (
        <ServiceProcess title={service.processTitle || ""} steps={service.processSteps} />
      ) : null}

      {service.relatedServices && service.relatedServices.length > 0 ? (
        <RelatedServices services={service.relatedServices} locale={locale} />
      ) : null}

      {showBottomCta ? (
        <section className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden bg-surface-container-low">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-12 translate-x-20" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="text-center md:text-left">
              {(service.ctaTitle || service.ctaAccent) && (
                <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-6xl text-black uppercase tracking-tighter">
                  {service.ctaTitle ? `${service.ctaTitle} ` : null}
                  {service.ctaAccent ? <span className="text-primary">{service.ctaAccent}</span> : null}
                </h2>
              )}
              {service.ctaDescription ? (
                <p className="text-on-surface-variant mt-4 text-lg">{service.ctaDescription}</p>
              ) : null}
            </div>
            {service.ctaButton ? (
              <Link
                href={`/${locale}/booking`}
                className="kinetic-gradient text-white px-10 md:px-12 py-4 md:py-5 font-label font-bold uppercase tracking-widest text-base md:text-lg shadow-[0_4px_20px_rgba(220,0,0,0.3)] hover:scale-105 transition-transform active:scale-95 shrink-0"
              >
                {service.ctaButton}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
