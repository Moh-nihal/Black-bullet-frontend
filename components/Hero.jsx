import Image from "next/image";
import Link from "next/link";

export default function Hero({ data }) {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center pt-24 md:pt-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Dark high performance supercar in Dubai desert at night"
          fill
          className="object-cover grayscale opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="max-w-3xl">
          <h1 className="font-headline font-black text-[clamp(48px,6vw,96px)] leading-[1.1] tracking-tighter mb-6 uppercase">
            {data?.heading || "THE KINETIC"}{" "}
            <span className="text-primary italic">{data?.accentWord || "MONOLITH"}</span>{" "}
            {data?.headingSuffix || "OF DUBAI PERFORMANCE"}
          </h1>
          <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-10">
            <Link
              href={data?.ctaPrimaryLink || "/booking"}
              className="kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-widest text-sm md:text-base px-8 py-4 shadow-[0_0_30px_rgba(255,143,115,0.3)] text-center hover:brightness-110 transition-all inline-block"
            >
              {data?.ctaPrimaryText || "Book Now"}
            </Link>
            <Link
              href={data?.ctaSecondaryLink || "https://wa.me/971000000000"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-container/20 border border-outline-variant/30 backdrop-blur-md text-white font-headline font-bold uppercase tracking-widest text-sm md:text-base px-8 py-4 flex items-center justify-center gap-3 hover:bg-white/10 transition-all inline-flex"
            >
              <span className="material-symbols-outlined text-[1.2em]">chat</span>
              {data?.ctaSecondaryText || "WhatsApp Us"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
