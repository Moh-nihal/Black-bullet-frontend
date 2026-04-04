"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en";

  const handleToggle = () => {
    const targetLocale = currentLocale === "en" ? "ar" : "en";
    let newPathname = pathname;
    
    if (pathname.startsWith(`/${currentLocale}/`) || pathname === `/${currentLocale}`) {
       newPathname = pathname.replace(new RegExp(`^/${currentLocale}`), `/${targetLocale}`);
    } else {
       newPathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;
    }

    router.push(newPathname);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1 text-sm font-bold tracking-widest text-on-surface-variant hover:text-black uppercase transition-colors"
      aria-label="Toggle language"
    >
      <span className="material-symbols-outlined text-[20px]">language</span>
      {currentLocale === "en" ? "العربية" : "ENG"}
    </button>
  );
}
