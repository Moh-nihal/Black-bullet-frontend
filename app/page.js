import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import TestimonialCard from "@/components/TestimonialCard";
import Image from "next/image";
import Link from "next/link";
import { getHomeContent } from "@/lib/api/content";
import { getGoogleReviews } from "@/lib/api/reviews";

export const metadata = {
  title: "Black Bullet Garage Performance | Dubai",
  description:
    "The pinnacle of performance tuning and aesthetic restoration in Dubai. ECU remapping, detailing, PPF, and bespoke automotive engineering.",
};

function PillarsSection({ data }) {
  const pillars = data?.length > 0 ? data : [
    {
      icon: "precision_manufacturing",
      title: "Precision",
      desc: "Aerospace-grade diagnostic tools and master technicians calibrated for millimetric accuracy.",
    },
    {
      icon: "thermostat",
      title: "Dubai Heat Optimized",
      desc: "Engineered thermal management systems designed to conquer the most extreme desert climates.",
    },
    {
      icon: "military_tech",
      title: "Elite Craftsmanship",
      desc: "A bespoke approach where every vehicle is treated as a singular piece of kinetic engineering.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className={`p-8 md:p-12 ${
                i < 2 ? "md:border-r border-outline-variant/10" : ""
              } hover:bg-surface-container transition-all group ${
                i === 1 ? "bg-surface-container-low" : ""
              }`}
            >
              <span className="material-symbols-outlined text-primary text-[clamp(32px,3vw,48px)] mb-6 md:mb-8 block">
                {p.icon}
              </span>
              <h3 className="font-headline font-bold text-[clamp(18px,1.5vw,24px)] mb-4 uppercase tracking-tight">
                {p.title}
              </h3>
              <p className="text-on-surface-variant font-body leading-relaxed text-[clamp(14px,1.2vw,18px)]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapSection({ data }) {
  return (
    <section className="h-[350px] md:h-[500px] w-full relative grayscale overflow-hidden group">
      <div className="absolute inset-0 z-0">
        <Image
          src={data?.backgroundImage || "/images/map-dubai.jpg"}
          alt="Stylized map of Dubai with Black Bullet Garage location"
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized={!!data?.backgroundImage}
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="glass-panel p-8 md:p-12 text-center max-w-lg border border-white/10 mx-auto w-full">
          <h3 className="font-headline font-black text-[clamp(24px,2.5vw,36px)] mb-4 uppercase tracking-tighter">
            {data?.title || "Visit the Forge"}
          </h3>
          <p className="font-body text-on-surface-variant mb-6 md:mb-8 text-[clamp(14px,1.2vw,18px)] whitespace-pre-line">
            {data?.addressText || "Al Quoz Industrial Area 3, Dubai, UAE.\nMon - Sat: 09:00 - 20:00"}
          </p>
          <Link
            href={data?.mapsLink || "https://maps.google.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black font-headline font-bold px-8 py-3.5 uppercase tracking-widest text-sm hover:bg-primary transition-all inline-block"
          >
            {data?.buttonText || "Get Directions"}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [contentRes, reviewsRes] = await Promise.all([
    getHomeContent(),
    getGoogleReviews()
  ]);

  const cmsData = contentRes?.data || {};

  return (
    <>
      <Hero data={cmsData.hero} />
      <PillarsSection data={cmsData.pillars?.items} />
      <BeforeAfterSlider data={cmsData.beforeAfter} />
      <ServiceCard data={cmsData.services?.items} />
      <TestimonialCard reviewsData={reviewsRes} />
      <MapSection data={cmsData.map} />
    </>
  );
}
