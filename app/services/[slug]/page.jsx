import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import ServiceDetailHero from "@/components/ServiceDetailHero";
import ServiceProcess from "@/components/ServiceProcess";
import RelatedServices from "@/components/RelatedServices";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function getApiService(slug) {
  try {
    const res = await fetch(`${API_URL}/api/public/services/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const apiService = await getApiService(slug);
  const localService = getServiceBySlug(slug);
  
  const title = apiService?.title || localService?.title;
  const description = apiService?.shortDesc || apiService?.description || localService?.heroDescription;

  if (!title) return {};

  return {
    title: `${title} | BLACK BULLET GARAGE`,
    description: description,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  
  // Try to fetch from API first, then look for local mock data as fallback
  const apiService = await getApiService(slug);
  const localService = getServiceBySlug(slug);

  if (!apiService && !localService) {
    notFound();
  }

  // Map API data into the rich shape expected by the frontend UI components
  const service = apiService ? {
    title: apiService.title || localService?.title || "Service",
    heroHeadline: apiService.title?.split(" ")[0] || "Service",
    heroAccent: apiService.title?.split(" ").slice(1).join(" ") || "Details",
    heroTag: "Excellence",
    heroImage: apiService.images?.[0] || localService?.heroImage || "/images/svc-mechanical-hero.jpg",
    heroDescription: apiService.shortDesc || apiService.description || localService?.heroDescription || "",
    descriptionTitle: apiService.title || localService?.descriptionTitle,
    descriptionParagraphs: apiService.description ? [apiService.description] : localService?.descriptionParagraphs || [],
    descriptionImage: apiService.images?.[1] || apiService.images?.[0] || localService?.descriptionImage || "/images/svc-mechanical-diag.jpg",
    descriptionImageAlt: apiService.title || "Service image",
    stats: apiService.features && apiService.features.length > 0 
      ? apiService.features.slice(0, 2).map(f => ({ label: "Feature", value: f })) 
      : localService?.stats || [{ value: "100%", label: "Precision" }, { value: "Quality", label: "Guarantee" }],
    processTitle: "The Process",
    processSteps: apiService.faqs && apiService.faqs.length > 0 
      ? apiService.faqs.map((f, i) => ({ num: `0${i+1}`, title: f.question, desc: f.answer, icon: "build" })) 
      : localService?.processSteps || [
          { num: "01", title: "Diagnostic", desc: "Initial assessment.", icon: "troubleshoot" },
          { num: "02", title: "Analysis", desc: "Data-driven strategy.", icon: "analytics" },
          { num: "03", title: "Execution", desc: "Precision implementation.", icon: "build" },
          { num: "04", title: "Quality Check", desc: "Validation process.", icon: "verified" },
        ],
    relatedServices: localService?.relatedServices || [],
    ctaTitle: "Ready for the",
    ctaAccent: "Next Level?",
    ctaDescription: "Book your technical consultation at our Dubai Performance Center.",
    ctaButton: "Schedule Now",
    isRemote: !!(apiService.images && apiService.images.length > 0)
  } : localService;

  return (
    <>
      <ServiceDetailHero service={service} />

      <section className="py-20 md:py-32 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-8">
            <h2 className="font-headline font-bold text-3xl md:text-4xl text-white uppercase tracking-tight">
              {service.descriptionTitle}
            </h2>
            <div className="space-y-4 text-on-surface-variant font-body leading-loose whitespace-pre-line">
              {service.descriptionParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-outline-variant/20">
              {service.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-primary font-headline font-black text-2xl md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
            <Image
              src={service.descriptionImage}
              alt={service.descriptionImageAlt || "Service Description Image"}
              width={800}
              height={600}
              className="relative z-10 w-full grayscale contrast-125 border border-outline-variant/10 object-cover"
              unoptimized={service.isRemote}
            />
          </div>
        </div>
      </section>

      {service.processSteps && service.processSteps.length > 0 && (
        <ServiceProcess
          title={service.processTitle}
          steps={service.processSteps}
        />
      )}

      {service.relatedServices && service.relatedServices.length > 0 && (
        <RelatedServices services={service.relatedServices} />
      )}

      <section className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="text-center md:text-left">
            <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-6xl text-white uppercase tracking-tighter">
              {service.ctaTitle}{" "}
              <span className="text-primary">{service.ctaAccent}</span>
            </h2>
            <p className="text-on-surface-variant mt-4 text-lg">
              {service.ctaDescription}
            </p>
          </div>
          <Link
            href="/booking"
            className="bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-10 md:px-12 py-4 md:py-5 font-label font-bold uppercase tracking-widest text-base md:text-lg shadow-[0_0_50px_rgba(255,143,115,0.3)] hover:scale-105 transition-transform active:scale-95 shrink-0"
          >
            {service.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
