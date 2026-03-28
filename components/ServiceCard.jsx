import Link from "next/link";

const serviceSummaries = [
  {
    icon: "settings_input_component",
    title: "Mechanical & Electrical",
    description: "Complete engine overhauls and diagnostic electrical operations.",
    slug: "mechanical-electrical"
  },
  {
    icon: "speed",
    title: "ECU Tuning",
    description: "Proprietary performance maps calibrated for local fuel and heat.",
    slug: "ecu-programming"
  },
  {
    icon: "car_repair",
    title: "Body Repair",
    description: "Chassis alignment and carbon-fiber panel restoration.",
    slug: "body-repair"
  },
  {
    icon: "auto_awesome",
    title: "Detailing",
    description: "Multi-stage correction and ceramic molecular bonding.",
    slug: "detailing-ceramic"
  },
  {
    icon: "layers",
    title: "PPF",
    description: "Self-healing invisible shielding against desert debris.",
    slug: "ppf-wrapping"
  },
  {
    icon: "brightness_low",
    title: "Tinting",
    description: "Nanotechnology films with 99.9% heat and UV rejection.",
    slug: "window-tinting"
  },
];

export default function ServiceCard({ data }) {
  const items = data || serviceSummaries;
  
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
          <div>
            <h2 className="font-headline font-black text-[clamp(28px,4vw,48px)] uppercase tracking-tighter">
              Performance <br />
              <span className="text-primary">Ecosystem</span>
            </h2>
          </div>
          <div className="hidden md:block pb-4 border-b border-outline w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant/20">
          {items.map((service, index) => (
            <div
              key={service.slug}
              className="bg-surface p-8 border hover:bg-surface-container border-transparent hover:border-outline-variant/30 transition-all group relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 font-headline font-black text-[clamp(48px,5vw,72px)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <span className="material-symbols-outlined text-[clamp(28px,2.5vw,36px)] mb-6 text-primary">
                {service.icon}
              </span>
              <h4 className="font-headline font-bold text-[clamp(16px,1.5vw,20px)] mb-4 uppercase text-white">
                {service.title}
              </h4>
              <p className="text-on-surface-variant mb-8 font-body flex-1 text-[clamp(14px,1.2vw,18px)]">
                {service.description}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-auto text-primary font-headline font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                Explore{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
