"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { href: "/", label: "Home", labelAr: "الرئيسية" },
  { href: "/services", label: "Services", labelAr: "الخدمات" },
  { href: "/gallery", label: "Gallery", labelAr: "المعرض" },
  { href: "/blog", label: "Blog", labelAr: "المدونة" },
];

export default function Navbar({ locale: localeProp }) {
  const pathname = usePathname();
  /** Prefer server layout locale; pathname is fallback for edge cases. */
  const navLocale =
    localeProp === "ar" || localeProp === "en"
      ? localeProp
      : pathname?.startsWith("/ar")
        ? "ar"
        : "en";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-black/5"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1200px] mx-auto">
        {/* Logo */}
        <Link
          href={`/${navLocale}`}
          className="font-headline text-2xl font-black italic tracking-tighter text-black uppercase"
        >
          BLACK BULLET
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const localizedHref = link.href === "/" ? `/${navLocale}` : `/${navLocale}${link.href}`;
            const isActive = link.href === "/" 
              ? pathname === localizedHref 
              : pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
            return (
              <Link
                key={link.href}
                href={localizedHref}
                className={`font-headline uppercase tracking-[0.05em] font-bold text-sm transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-black"
                }`}
              >
                {navLocale === "ar" ? link.labelAr : link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-black"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors hidden md:block">
            chat
          </span>
          <Link
            href={`/${navLocale}/booking`}
            className="kinetic-gradient text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-3 transition-all active:scale-95 hover:brightness-110 hidden md:block shadow-[0_4px_15px_rgba(220,0,0,0.3)]"
          >
            {navLocale === "ar" ? "احجز الآن" : "Book Now"}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/10 px-6 py-6 space-y-4 shadow-lg">
          <div className="pb-2 border-b border-black/5">
            <LanguageSwitcher />
          </div>
          {navLinks.map((link) => {
            const localizedHref = link.href === "/" ? `/${navLocale}` : `/${navLocale}${link.href}`;
            const isActive = link.href === "/" 
              ? pathname === localizedHref 
              : pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
            return (
              <Link
                key={link.href}
                href={localizedHref}
                onClick={() => setMobileOpen(false)}
                className={`block font-headline uppercase tracking-[0.05em] font-bold text-sm py-2 ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-black"
                }`}
              >
                {navLocale === "ar" ? link.labelAr : link.label}
              </Link>
            );
          })}
          <Link
            href={`/${navLocale}/booking`}
            onClick={() => setMobileOpen(false)}
            className="block kinetic-gradient text-white font-headline font-bold uppercase tracking-widest text-xs px-6 py-3 text-center mt-4"
          >
            {navLocale === "ar" ? "احجز الآن" : "Book Now"}
          </Link>
        </div>
      )}
    </nav>
  );
}
