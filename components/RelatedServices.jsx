import Link from "next/link";

export default function RelatedServices({ services, locale = "en" }) {
  const isAr = locale === "ar";
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-black uppercase tracking-tight">
              {isAr ? "ترقيات متكاملة" : "Synergistic Upgrades"}
            </h2>
            <p className="text-on-surface-variant mt-4">
              {isAr
                ? "أكمل تحويل أداء مركبتك مع خدماتنا الأساسية."
                : "Complete your vehicle's performance transformation with our core services."}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((svc) => (
            <Link
              key={svc.title}
              href={svc.link}
              className="glass-card p-1 relative overflow-hidden group cursor-pointer block"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="p-8 md:p-12 border border-black/10">
                <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-6 block">
                  {svc.icon}
                </span>
                <h3 className="font-headline font-bold text-xl md:text-2xl text-black uppercase mb-4 tracking-wider">
                  {svc.title}
                </h3>
                <p className="text-on-surface-variant mb-6 md:mb-8 max-w-md leading-relaxed">
                  {svc.desc}
                </p>
                <div className="flex items-center gap-2 text-primary font-label font-bold uppercase text-xs tracking-widest">
                  {svc.cta}{" "}
                  <span className="material-symbols-outlined text-sm">
                    trending_flat
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
