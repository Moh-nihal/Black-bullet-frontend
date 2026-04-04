import BookingForm from "@/components/BookingForm";
import Link from "next/link";

export const metadata = {
  title: "Book Your Performance | BLACK BULLET",
  description:
    "Reserve your stall at Black Bullet Garage Performance Dubai. Multi-step booking for ECU tuning, carbon aero, and performance services.",
};

export default async function BookingPage({ params }) {
  const p = await params;
  const locale = p?.locale === "ar" ? "ar" : "en";

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen bg-white">
      {/* Title & Quick Actions */}
      <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="font-label font-bold text-primary tracking-[0.3em] uppercase block mb-4">
            {locale === "ar" ? "حجز دقيق" : "Precision Booking"}
          </span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-black text-black tracking-tighter leading-none">
            {locale === "ar" ? "احجز " : "RESERVE YOUR "} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim">
              {locale === "ar" ? "مساحتك." : "STALL."}
            </span>
          </h1>
        </div>

        {/* Quick WhatsApp */}
        <div className="bg-surface-container-low border border-black/10 border-l-4 border-l-primary p-4 md:p-6 flex items-center gap-4 md:gap-6 group hover:bg-surface-container transition-colors">
          <div className="bg-[#25D366]/20 p-3 md:p-4">
            <span className="material-symbols-outlined text-[#25D366] text-2xl md:text-3xl">
              chat_bubble
            </span>
          </div>
          <div>
            <p className="font-label font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              {locale === "ar" ? "وصول فوري" : "Instant Access"}
            </p>
            <p className="font-headline font-bold text-black text-base md:text-lg">
              {locale === "ar" ? "مساعد واتساب" : "WhatsApp Concierge"}
            </p>
            <Link
              href="https://wa.me/971000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-bold flex items-center gap-1 mt-1 group-hover:gap-2 transition-all"
            >
              {locale === "ar" ? "بدء المحادثة" : "START CHAT"}{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>

      <BookingForm />
    </div>
  );
}
