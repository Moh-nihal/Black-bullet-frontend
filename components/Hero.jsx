import Image from "next/image";
import Link from "next/link";
import { withLocalePrefix } from "@/lib/localePath";

export default function Hero({ data, locale = "en" }) {
  const bg = data?.backgroundImage;

  return (
    <section className="relative min-h-[90vh] lg:min-h-[95vh] 2xl:min-h-screen w-full flex items-center pt-24 md:pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        {bg ? (
          <Image
            src={bg}
            alt={data?.heading || ""}
            fill
            className="object-cover object-center"
            priority
            unoptimized={typeof bg === "string" && bg.startsWith("http")}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="max-w-3xl">
          {(data?.heading || data?.accentWord || data?.headingSuffix) && (
            <h1 className="font-headline font-black text-[clamp(48px,6vw,96px)] leading-[1.1] tracking-tighter mb-6 uppercase text-white">
              {data?.heading ? `${data.heading} ` : null}
              {data?.accentWord ? <span className="text-primary italic">{data.accentWord}</span> : null}
              {data?.headingSuffix ? ` ${data.headingSuffix}` : null}
            </h1>
          )}
          {(data?.ctaPrimaryText || data?.ctaSecondaryText) && (
            <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-10">
              {data?.ctaPrimaryText && (
                <Link
                  href={withLocalePrefix(data?.ctaPrimaryLink || "/booking", locale)}
                  className="kinetic-gradient text-white font-headline font-black uppercase tracking-widest text-sm md:text-base px-8 py-4 shadow-[0_4px_20px_rgba(220,0,0,0.4)] text-center hover:brightness-110 transition-all inline-block"
                >
                  {data.ctaPrimaryText}
                </Link>
              )}
              {data?.ctaSecondaryText && (
                <Link
                  href={data?.ctaSecondaryLink || "https://wa.me/971000000000"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/15 border border-white/30 backdrop-blur-md text-white font-headline font-bold uppercase tracking-widest text-sm md:text-base px-8 py-4 flex items-center justify-center gap-3 hover:bg-white/25 transition-all inline-flex"
                >
                  <span className="material-symbols-outlined text-[1.2em]">chat</span>
                  {data.ctaSecondaryText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
