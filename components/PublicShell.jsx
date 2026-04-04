"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function PublicShell({ children, locale = "en" }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isLanding = pathname.startsWith("/landing");
  const shellLocale = locale === "ar" ? "ar" : "en";

  // Admin pages and landing pages skip navbar/footer
  if (isAdmin || isLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar locale={shellLocale} />
      <main>{children}</main>
      <Footer locale={shellLocale} />
      <WhatsAppButton />
    </>
  );
}
