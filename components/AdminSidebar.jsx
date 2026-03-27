"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/admin" },
  { icon: "calendar_today", label: "Bookings", href: "/admin/bookings" },
  { icon: "build", label: "Services", href: "/admin/services" },
  { icon: "collections", label: "Gallery", href: "/admin/gallery" },
  { icon: "article", label: "Blog", href: "/admin/blog" },
  { icon: "edit_note", label: "Website Content", href: "/admin/content" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (err) {
      toast.error("Error logging out");
      // Still push them to login as fallback
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-[60] p-1.5 bg-surface-container rounded-sm border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
      >
        <span className="material-symbols-outlined text-white text-xl">menu</span>
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed md:relative top-0 left-0 h-screen w-64 border-r border-white/5 bg-[#131313] flex flex-col shrink-0 z-[70] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Branding */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-fixed font-bold">
              bolt
            </span>
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tighter uppercase font-headline">
              BB Garage
            </h2>
            <p className="font-label tracking-[0.05em] uppercase text-[10px] font-bold text-primary">
              Performance Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 font-label tracking-[0.05em] uppercase text-xs font-bold transition-all ${
              isActive(item.href)
                ? "text-primary bg-white/5 border-l-4 border-primary translate-x-1"
                : "text-on-surface-variant hover:bg-white/5 hover:text-white border-l-4 border-transparent"
            }`}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={
                isActive(item.href)
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Link
          href="/admin/bookings"
          className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-label font-bold py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Booking
        </Link>
        <button
          onClick={handleLogout}
          className="w-full bg-surface-container border border-outline-variant/20 hover:border-primary hover:text-primary text-on-surface-variant transition-colors font-label font-bold py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>
    </>
  );
}
