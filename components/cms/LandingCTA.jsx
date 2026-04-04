"use client";

export default function LandingCTA({ variantId, slug, apiUrl, content }) {
  const handleCTA = (type) => {
    try {
      fetch(`${apiUrl || ''}/api/public/landing/${slug}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, variantId }),
      }).catch(() => {});
    } catch(e) {}
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
       <a
          href={`https://wa.me/${content.whatsappNumber || "971000000000"}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleCTA('whatsapp')}
          className="bg-[#25D366] text-white font-headline border-none font-bold uppercase tracking-widest text-sm md:text-base px-8 py-4 flex items-center justify-center gap-3 hover:bg-[#1DA851] transition-all shadow-lg shadow-[#25D366]/20"
        >
          <span className="material-symbols-outlined text-[1.2em]">chat</span>
          {content.ctaText || "Chat on WhatsApp"}
      </a>
      <a
        href={`tel:${content.phoneNumber || "+971000000000"}`}
        onClick={() => handleCTA('call')}
        className="bg-white text-black font-headline font-black uppercase tracking-widest text-sm md:text-base px-8 py-4 flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-lg"
      >
        <span className="material-symbols-outlined text-[1.2em]">call</span>
        {content.callCtaText || "Call Now"}
      </a>
    </div>
  );
}
