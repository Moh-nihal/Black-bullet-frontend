import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Services | Black Bullet Garage Performance",
  description:
    "ECU programming, advanced diagnostics, mechanical repair, electrical systems, performance tuning, and custom exhaust solutions in Dubai.",
};

// Fallback data
const fallbackServices = [
  { num: "01", title: "ECU Programming", img: "/images/service-ecu.jpg", alt: "High-tech engine control unit with wiring", desc: "Bespoke engine remapping for ultimate power and efficiency.", active: true, slug: "ecu-programming" },
  { num: "02", title: "Advanced Diagnostics", img: "/images/service-diag.jpg", alt: "Digital diagnostic tool plugged into car", slug: "ecu-programming" },
  { num: "03", title: "Mechanical Repair", img: "/images/service-mech.jpg", alt: "Mechanic working on high performance engine", slug: "mechanical-electrical" },
  { num: "04", title: "Electrical Systems", img: "/images/service-elec.jpg", alt: "Complex electrical wiring and circuit boards", slug: "mechanical-electrical" },
  { num: "05", title: "Performance Tuning", img: "/images/service-perf.jpg", alt: "Racing car on a dynamometer", slug: "ecu-programming" },
  { num: "06", title: "Custom Exhaust", img: "/images/service-exhaust.jpg", alt: "Titanium exhaust pipe with blue heat tint", slug: "mechanical-electrical" },
];

async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/services?limit=50`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const apiServices = await getServices();

  // Map API services to display format, or use fallback
  const services = apiServices.length > 0
    ? apiServices.map((s, i) => ({
        num: String(i + 1).padStart(2, "0"),
        title: s.title,
        img: s.images?.[0] || `/images/service-ecu.jpg`,
        alt: s.title,
        desc: s.shortDesc || s.description || "",
        active: i === 0,
        slug: s.slug || s._id,
        isRemote: !!(s.images?.[0]),
      }))
    : fallbackServices;

  // Take first active service for the ECU Detail section
  const detailService = apiServices.length > 0 ? apiServices[0] : null;

  return (
    <>
      {/* Hero */}
      <section className="px-4 lg:px-6 pt-28 md:pt-32 pb-12 bg-surface-dim relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <span className="font-label text-primary font-bold tracking-[0.2em] uppercase text-sm block mb-4">
            Mastering Precision
          </span>
          <h1 className="font-headline text-[clamp(48px,6vw,96px)] font-black tracking-widest uppercase mb-6 leading-none">
            Performance <br />
            <span className="text-primary-dim">Solutions</span>
          </h1>
          <p className="max-w-2xl text-on-surface-variant text-[clamp(14px,1.2vw,18px)] leading-relaxed">
            We push the boundaries of automotive engineering. From Stage 3 ECU
            calibrations to complete mechanical overhauls, our garage is a temple
            for the speed-obsessed.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 lg:px-6 py-10 md:py-16 bg-surface">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {services.map((s) => (
            <Link
              href={`/services/${s.slug}`}
              key={s.num}
              className="group relative aspect-[4/5] bg-surface-container overflow-hidden border border-outline-variant/10 cursor-pointer"
            >
              <Image
                src={s.img}
                alt={s.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={!!s.isRemote}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                <span className={`font-label text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-2 block transition-colors ${s.active ? "text-primary" : "text-on-surface-variant group-hover:text-primary"}`}>
                  Service {s.num}
                </span>
                <h3 className="font-headline text-[clamp(18px,2vw,24px)] font-bold uppercase mb-4 text-white">
                  {s.title}
                </h3>
                <div className={`h-1 w-12 group-hover:w-full transition-all duration-500 ${s.active ? "bg-primary" : "bg-white group-hover:bg-primary"}`} />
                {s.desc && (
                  <p className="mt-4 text-on-surface-variant text-[clamp(12px,1vw,14px)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                    {s.desc}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ECU Detail */}
      <section className="bg-surface-dim py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-20 bg-primary" />
              <span className="font-label text-primary font-bold tracking-widest uppercase text-sm">
                Service Focus
              </span>
            </div>
            <h2 className="font-headline text-[clamp(28px,4vw,48px)] font-black uppercase mb-8 leading-tight">
              {detailService?.title || "ECU Programming"} <br />
              &amp; <span className="text-primary">Diagnostics</span>
            </h2>
            <div className="space-y-6 text-on-surface-variant text-[clamp(14px,1.2vw,18px)] leading-relaxed">
              <p>
                {detailService?.description || "Our ECU programming service is not a simple \"off-the-shelf\" flash. We provide custom calibration designed specifically for your vehicle's hardware configuration, fuel grade, and desired performance characteristics."}
              </p>
              <p>
                Leveraging state-of-the-art diagnostic equipment, we interface
                directly with your vehicle&apos;s brain to unlock hidden potential,
                improve throttle response, and optimize torque curves while
                maintaining strict safety parameters.
              </p>
            </div>
            <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-surface-container p-6 border-l-4 border-primary">
                <h4 className="font-label font-bold text-white uppercase text-sm mb-2 tracking-wider">
                  Dyno Proven
                </h4>
                <p className="text-on-surface-variant text-sm">
                  Every tune is validated for consistent power delivery and
                  thermal efficiency.
                </p>
              </div>
              <div className="bg-surface-container p-6 border-l-4 border-primary">
                <h4 className="font-label font-bold text-white uppercase text-sm mb-2 tracking-wider">
                  OEM+ Reliability
                </h4>
                <p className="text-on-surface-variant text-sm">
                  Software updates that maintain factory safety protocols and
                  emissions standards.
                </p>
              </div>
            </div>
            <div className="mt-10 md:mt-12">
              <Link
                href="/booking"
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-tr from-primary-dim to-primary text-on-primary-fixed font-headline font-black uppercase tracking-[0.15em] text-sm md:text-base hover:brightness-110 transition-all flex items-center justify-center gap-3 inline-flex"
              >
                Book This Service
                <span className="material-symbols-outlined text-[1.2rem]">trending_flat</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-square bg-surface-container-highest">
              <Image
                src={detailService?.images?.[0] || "/images/ecu-laptop.jpg"}
                alt="Laptop displaying 3D fuel map tuning software"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized={!!(detailService?.images?.[0])}
              />
              <div className="absolute top-4 left-4 glass-overlay px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-label text-xs font-bold text-white uppercase tracking-tighter">
                  Live Telemetry
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-surface text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-6">
          <h2 className="font-headline text-[clamp(32px,5vw,64px)] font-black uppercase mb-6 md:mb-8 leading-tight">
            Ready to <span className="text-glow text-primary">Elevate</span>{" "}
            Your Drive?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 w-full md:w-auto px-4">
            <Link
              href="/booking"
              className="bg-primary text-on-primary-fixed px-8 py-4 font-headline font-bold uppercase tracking-[0.2em] text-[clamp(12px,1vw,14px)] hover:scale-105 transition-transform inline-block w-full md:w-auto"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/services"
              className="border border-outline px-8 py-4 font-headline font-bold uppercase tracking-[0.2em] text-[clamp(12px,1vw,14px)] hover:bg-surface-container-highest transition-colors inline-block w-full md:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
