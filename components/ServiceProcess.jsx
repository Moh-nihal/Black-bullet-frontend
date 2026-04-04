export default function ServiceProcess({ title, steps }) {
  const getGridClasses = (count) => {
    if (count === 1) return "grid-cols-1 max-w-sm mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto";
    if (count === 3) return "grid-cols-1 md:grid-cols-3 mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="font-headline font-black text-4xl md:text-5xl text-black uppercase tracking-tighter">
            {title}
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto mt-4" />
        </div>
        <div className={`grid gap-1 ${getGridClasses(steps.length)}`}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`${
                i % 2 === 0
                  ? "bg-surface-container-highest"
                  : "bg-surface-container"
              } p-8 md:p-10 hover:bg-white transition-all group`}
            >
              <div className="text-primary font-headline font-black text-3xl md:text-4xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">
                {step.num}
              </div>
              <h3 className="font-headline font-bold text-lg md:text-xl text-black uppercase mb-4">
                {step.title}
              </h3>
              <p className="text-on-surface-variant text-sm font-body">
                {step.desc}
              </p>
              <span className="material-symbols-outlined text-primary mt-6 md:mt-8 block">
                {step.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
