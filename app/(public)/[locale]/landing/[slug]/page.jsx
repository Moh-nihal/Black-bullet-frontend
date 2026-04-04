import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LandingLeadForm from "@/components/cms/LandingLeadForm";
import LandingCTA from "@/components/cms/LandingCTA";
import api from "@/lib/api";

async function getLandingData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/public/landing/${slug}`, { 
      cache: 'no-store' // We need fresh variant assignments
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getLandingData(slug);
  if (!data) return { title: "Not Found" };

  return {
    title: data.metaTitle?.en || data.title,
    description: data.metaDescription?.en || "",
  };
}

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const data = await getLandingData(slug);

  if (!data) {
    notFound();
  }

  const content = data.variant.content || {};

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden py-16 lg:py-0">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.heroImage || "/images/hero-car.jpg"}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-headline font-black text-[clamp(40px,5vw,72px)] leading-[1.1] tracking-tighter mb-6 text-white uppercase">
              {content.headline || "PREMIUM PERFORMANCE UPGRADES IN DUBAI"}
            </h1>
            <p className="font-body text-white/80 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {content.subHeadline || "Unlock your vehicle's true potential with bespoke ECU tuning, performance exhausts, and lightweight carbon fiber aero."}
            </p>

            <LandingCTA 
              variantId={data.variant._id} 
              slug={data.slug} 
              apiUrl={process.env.NEXT_PUBLIC_API_URL} 
              content={content} 
            />

            {content.highlights && content.highlights.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12 text-center lg:text-left">
                {content.highlights.map((highlight, idx) => {
                  const label = typeof highlight === "string" ? highlight : highlight.label || highlight;
                  const subText = typeof highlight === "string" ? "Guaranteed" : highlight.subText || highlight.sub || "Guaranteed";
                  
                  return (
                    <div key={idx}>
                      <h3 className="text-primary font-black font-headline text-2xl mb-1">{label}</h3>
                      <p className="text-white/60 font-body text-xs uppercase tracking-widest">{subText}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-full lg:w-[450px]">
            <LandingLeadForm 
              slug={data.slug} 
              variantId={data.variant._id} 
              apiUrl={process.env.NEXT_PUBLIC_API_URL}
            />
          </div>
        </div>
      </section>

      {/* Trust Badges / Footer Strip */}
      <footer className="w-full bg-white border-t border-outline-variant/50 py-8 px-6 text-center">
        <p className="font-headline font-bold text-xs uppercase tracking-widest text-black/50">
          Black Bullet Garage © {new Date().getFullYear()} — Dubai, UAE
        </p>
      </footer>
    </div>
  );
}
