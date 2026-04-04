"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Link from "next/link";
import LandingPageForm from "@/components/cms/LandingPageForm";

export default function AdminNewLandingPage() {
  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        <header className="flex flex-wrap justify-between items-center w-full gap-x-4 gap-y-4 px-4 pl-14 md:px-8 lg:px-12 py-4 md:py-6 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="order-1 flex items-center gap-4 md:gap-8 w-auto h-8">
            <Link href="/admin/landing" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </Link>
            <h2 className="font-headline text-[15px] md:text-2xl font-black tracking-widest text-black uppercase leading-none mt-1">
              Create Campaign
            </h2>
          </div>
          <div className="order-2 sm:order-last flex justify-end">
            <AdminUserBadge />
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <LandingPageForm />
        </div>
      </main>
    </>
  );
}
