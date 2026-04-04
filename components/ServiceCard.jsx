import Link from "next/link";

export default function ServiceCard({ data, locale = "en" }) {
  const loc = locale === "ar" ? "ar" : "en";
  const items = Array.isArray(data) ? data : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((service, index) => (
            <div
              key={service.slug || index}
              className="bg-white p-8 border border-black/10 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(220,0,0,0.08)] transition-all group relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.04] font-headline font-black text-[clamp(48px,5vw,72px)] text-black">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[clamp(24px,2vw,28px)] text-primary">
                  {service.icon}
                </span>
              </div>
              <h4 className="font-headline font-bold text-[clamp(16px,1.5vw,20px)] mb-4 uppercase text-black">
                {service.title}
              </h4>
              <p className="text-on-surface-variant mb-8 font-body flex-1 text-[clamp(14px,1.2vw,18px)]">
                {service.description}
              </p>
              <Link
                href={`/${loc}/services/${service.slug}`}
                className="mt-auto text-primary font-headline font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-4 transition-all"
                aria-label="View service"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
