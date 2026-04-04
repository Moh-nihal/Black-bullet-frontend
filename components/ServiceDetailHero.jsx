import Image from "next/image";
import Link from "next/link";

export default function ServiceDetailHero({ service, locale = "en" }) {
  const loc = locale === "ar" ? "ar" : "en";
  const img = service.heroImage;

  return (
    <section className="relative h-[500px] md:h-[820px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        {img ? (
          typeof img === "string" && img.match(/\.(mp4|webm|mov)(\?|#|$)/i) ? (
            <video src={img} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
            <Image
              src={img}
              alt={service.title || ""}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized={typeof img === "string" && img.startsWith("http")}
            />
          )
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 px-6 md:px-12 w-full max-w-7xl mx-auto">
        <div className="max-w-3xl">
          {service.heroTag ? (
            <span className="inline-block px-4 py-1 bg-primary/20 border border-primary/30 text-white font-label font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
              {service.heroTag}
            </span>
          ) : null}
          {service.heroHeadline ? (
            <h1 className="font-headline font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-none mb-8">
              {service.heroAccent ? (
                <>
                  {service.heroHeadline} <br />
                  <span className="text-primary italic">{service.heroAccent}</span>
                </>
              ) : (
                <span className="text-primary italic">{service.heroHeadline}</span>
              )}
            </h1>
          ) : null}
          {service.heroDescription ? (
            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl">{service.heroDescription}</p>
          ) : null}
          {service.heroCTA ? (
            <div className="flex gap-4">
              <Link
                href={`/${loc}/booking`}
                className="kinetic-gradient text-white px-10 py-4 font-label font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(220,0,0,0.4)]"
              >
                {service.heroCTA}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
