"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import ContentTabs from "@/components/cms/ContentTabs";
import HomePageEditor from "@/components/cms/HomePageEditor";
import ServicesPageEditor from "@/components/cms/LandingPageEditor";
import GalleryPageEditor from "@/components/cms/GalleryContentManager";
import BlogPageEditor from "@/components/cms/BlogPageEditor";
import GlobalSettingsEditor from "@/components/cms/GlobalSettingsEditor";
import TestimonialsManager from "@/components/cms/TestimonialsManager";

/* ───────────────────────────────────────────────────────────
   Pre-filled mock data — extracted from actual website content
   ─────────────────────────────────────────────────────────── */

const initialHomeData = {
  hero: {
    backgroundImage: null,
    heading: "THE KINETIC",
    accentWord: "MONOLITH",
    headingSuffix: "OF DUBAI PERFORMANCE",
    ctaPrimaryText: "Book Now",
    ctaPrimaryLink: "/booking",
    ctaSecondaryText: "WhatsApp Us",
    ctaSecondaryLink: "https://wa.me/971000000000",
  },
  pillars: {
    items: [
      { icon: "precision_manufacturing", title: "Precision", description: "Aerospace-grade diagnostic tools and master technicians calibrated for millimetric accuracy." },
      { icon: "thermostat", title: "Dubai Heat Optimized", description: "Engineered thermal management systems designed to conquer the most extreme desert climates." },
      { icon: "military_tech", title: "Elite Craftsmanship", description: "A bespoke approach where every vehicle is treated as a singular piece of kinetic engineering." },
    ],
  },
  beforeAfter: {
    heading: "Paint",
    accentWord: "Restoration",
    subtitle: "Swipe to witness the evolution from desert-worn to showroom-flawless.",
    beforeImage: null,
    afterImage: null,
  },
  services: {
    items: [
      { icon: "settings_input_component", title: "Mechanical & Electrical", description: "Complete engine overhauls and diagnostic electrical operations.", slug: "mechanical-electrical" },
      { icon: "speed", title: "ECU Tuning", description: "Proprietary performance maps calibrated for local fuel and heat.", slug: "ecu-programming" },
      { icon: "car_repair", title: "Body Repair", description: "Chassis alignment and carbon-fiber panel restoration.", slug: "body-repair" },
      { icon: "auto_awesome", title: "Detailing", description: "Multi-stage correction and ceramic molecular bonding.", slug: "detailing-ceramic" },
      { icon: "layers", title: "PPF", description: "Self-healing invisible shielding against desert debris.", slug: "ppf-wrapping" },
      { icon: "brightness_low", title: "Tinting", description: "Nanotechnology films with 99.9% heat and UV rejection.", slug: "window-tinting" },
    ],
  },
  testimonials: [
    { id: 1, initials: "KA", name: "Khalid Al-Maktoum", quote: "Black Bullet completely transformed my 911 Turbo S. The ECU tuning in Dubai's heat usually causes lag, but their map is flawless. True professionals.", rating: 5, highlight: true },
    { id: 2, initials: "MS", name: "Mark Saunders", quote: "Best detailing job I've seen in the UAE. The PPF application is literally invisible. My car looks better than when it left the showroom.", rating: 5, highlight: false },
    { id: 3, initials: "RJ", name: "Reza Jafari", quote: "Professional mechanical work for high-end exotics. They diagnosed an issue my dealer couldn't find in 3 months. Highly recommend.", rating: 5, highlight: false },
  ],
  map: {
    backgroundImage: null,
    title: "Visit the Forge",
    addressText: "Al Quoz Industrial Area 3, Dubai, UAE.\nMon - Sat: 09:00 - 20:00",
    mapsLink: "https://maps.google.com",
    buttonText: "Get Directions",
  },
};

const initialServicesData = {
  hero: {
    label: "Mastering Precision",
    heading: "Performance",
    accentWord: "Solutions",
    description: "We push the boundaries of automotive engineering. From Stage 3 ECU calibrations to complete mechanical overhauls, our garage is a temple for the speed-obsessed.",
  },
  servicesGrid: [
    { num: "01", title: "ECU Programming", img: "/images/service-ecu.jpg", alt: "High-tech engine control unit with wiring", desc: "Bespoke engine remapping for ultimate power and efficiency.", slug: "ecu-programming" },
    { num: "02", title: "Advanced Diagnostics", img: "/images/service-diag.jpg", alt: "Digital diagnostic tool plugged into car", desc: "", slug: "ecu-programming" },
    { num: "03", title: "Mechanical Repair", img: "/images/service-mech.jpg", alt: "Mechanic working on high performance engine", desc: "", slug: "mechanical-electrical" },
    { num: "04", title: "Electrical Systems", img: "/images/service-elec.jpg", alt: "Complex electrical wiring and circuit boards", desc: "", slug: "mechanical-electrical" },
    { num: "05", title: "Performance Tuning", img: "/images/service-perf.jpg", alt: "Racing car on a dynamometer", desc: "", slug: "ecu-programming" },
    { num: "06", title: "Custom Exhaust", img: "/images/service-exhaust.jpg", alt: "Titanium exhaust pipe with blue heat tint", desc: "", slug: "mechanical-electrical" },
  ],
  ecuDetail: {
    label: "Service Focus",
    heading: "ECU Programming & Diagnostics",
    para1: "Our ECU programming service is not a simple \"off-the-shelf\" flash. We provide custom calibration designed specifically for your vehicle's hardware configuration, fuel grade, and desired performance characteristics.",
    para2: "Leveraging state-of-the-art diagnostic equipment, we interface directly with your vehicle's brain to unlock hidden potential, improve throttle response, and optimize torque curves while maintaining strict safety parameters.",
    features: [
      { title: "Dyno Proven", desc: "Every tune is validated for consistent power delivery and thermal efficiency." },
      { title: "OEM+ Reliability", desc: "Software updates that maintain factory safety protocols and emissions standards." },
    ],
  },
  cta: {
    heading: "Ready to",
    accentWord: "Elevate",
    suffix: "Your Drive?",
    primaryText: "Schedule Consultation",
    secondaryText: "View Pricing",
  },
};

const initialGalleryData = {
  header: {
    heading: "THE PROJECT",
    accentWord: "ARCHIVE",
    subtitle: "Witness the evolution of performance. From bespoke aerodynamic kits to radical engine remapping, explore our most prestigious Dubai builds.",
  },
  featured: {
    image: null,
    title: 'F8 TRIBUTO "ONYX"',
    subtitle: "Full Satin Black Wrap & Stage 2 Tune",
    hpLabel: "Performance Gains",
    hpValue: "+145 HP",
    hpDetail: "ECU Remapping & Exhaust",
    torqueLabel: "Torque Increase",
    torqueValue: "850 NM",
    torqueDetail: "Precision Tuning",
  },
  categories: ["All Projects", "Detailing", "Wrapping", "Performance"],
  gridItems: [
    { src: "/images/gallery-porsche.jpg", alt: "Silver Porsche 911 GT3 driving", title: "Track Precision Setup", subtitle: "Porsche 911 GT3", className: "masonry-item-tall" },
    { src: "/images/gallery-steering.jpg", alt: "Close up of a luxury car steering wheel", title: "", subtitle: "", className: "masonry-item-square" },
    { src: "/images/gallery-lambo.jpg", alt: "Lamborghini Aventador front view", title: "THE BULL OF DUBAI", subtitle: "Aventador SVJ Performance Kit", className: "masonry-item-wide" },
    { src: "/images/gallery-amg.jpg", alt: "Mercedes AMG engine details", title: "", subtitle: "", className: "masonry-item-square" },
    { src: "/images/gallery-supra.jpg", alt: "Custom white Supra drifting", title: "Supra MK5 Hybrid", subtitle: "Drift Spec", className: "masonry-item-tall" },
    { src: "/images/gallery-red.jpg", alt: "Red Ferrari detail", title: "", subtitle: "", className: "masonry-item-square" },
    { src: "/images/gallery-exhaust.jpg", alt: "Performance car exhaust with flames", title: "", subtitle: "Live from Workshop", className: "masonry-item-wide" },
  ],
  cta: {
    heading: "Ready to transform your machine into a",
    accentWord: "masterpiece?",
    primaryText: "Start Custom Project",
    secondaryText: "View Pricing",
  },
};

const initialBlogData = {
  featuredArticle: {
    image: null,
    category: "Engineering",
    date: "June 24, 2024",
    title: "The Future of ECU Remapping:",
    accentPhrase: "Beyond The Dyno",
    authorName: "Khalid Al-Mansouri",
    authorTitle: "Chief Performance Architect",
  },
  articleBody: {
    leadQuote: "In the heart of Dubai's performance culture, horsepower is no longer just a number—it's a digital symphony orchestrated through precision software engineering.",
    para1: "ECU (Engine Control Unit) remapping has evolved from simple chip-tuning to a complex multidimensional science. As we push the boundaries of modern internal combustion and hybrid powertrains, the methodology behind our calibrations must reflect the harsh environments of the GCC.",
    para2: 'At Black Bullet Garage, we don\'t just "flash" a map. We conduct a holistic analysis of thermal dynamics, fuel octane variances specific to the UAE, and the kinetic tolerances of each individual component. The future lies in predictive algorithms that adapt to real-time telemetry data.',
    calloutTitle: "Key Engineering Focus: Thermal Mitigation",
    para3: "The integration of carbon-fiber intake systems and bespoke exhaust manifolds requires a software-first approach. We are entering an era where mechanical upgrades are secondary to the logic gates that control them.",
  },
  relatedArticles: [
    { img: "/images/blog-car-night.jpg", alt: "Black sleek luxury supercar parked under city lights", category: "Custom Projects", title: "The Art of the Bespoke Exhaust", desc: "Exploring the sonic and performance characteristics of Grade 5 Titanium versus Inconel alloys." },
    { img: "/images/blog-parts.jpg", alt: "Modern workshop floor with automotive performance parts", category: "Maintenance", title: "Precision Fluid Engineering", desc: "Why high-performance builds require bespoke synthetic blends to combat extreme desert temperatures." },
    { img: "/images/blog-carbon.jpg", alt: "Extreme close up of high quality carbon fiber weave", category: "Industry News", title: "Next-Gen Carbon Infusion", desc: "How vacuum-sealed autoclave processes are redefining structural rigidity in body panels." },
  ],
  categories: [
    { name: "Tuning Guides", count: 14 },
    { name: "Project Cars", count: 8 },
    { name: "Maintenance", count: 21 },
    { name: "Industry News", count: 5 },
  ],
  recentPosts: [
    { category: "Maintenance", title: "PREPARING YOUR CAR FOR DUBAI SUMMER: THERMAL PROTECTION 101" },
    { category: "Engineering", title: "AERODYNAMIC EFFICIENCY IN CARBON FIBER BODY KITS" },
    { category: "Custom Projects", title: "PROJECT PHANTOM: 1000HP STREET LEGAL GTR BUILD" },
  ],
  newsletter: {
    title: "Performance Intel",
    description: "Get the latest engineering insights and tuning updates delivered to your inbox.",
  },
};

const initialSettingsData = {
  whatsappNumber: "971000000000",
  seoTitle: "Black Bullet Garage Performance | Dubai",
  metaDescription: "The pinnacle of performance tuning and aesthetic restoration in Dubai. ECU remapping, detailing, PPF, and bespoke automotive engineering.",
  footerTagline: "The pinnacle of performance tuning and aesthetic restoration in Dubai. Driven by precision, forged in heat.",
  copyrightText: "© 2024 BLACK BULLET GARAGE PERFORMANCE DUBAI. ALL RIGHTS RESERVED.",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=example",
  workingHours: [
    { day: "Monday", open: "09:00", close: "20:00", closed: false },
    { day: "Tuesday", open: "09:00", close: "20:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "20:00", closed: false },
    { day: "Thursday", open: "09:00", close: "20:00", closed: false },
    { day: "Friday", open: "09:00", close: "20:00", closed: false },
    { day: "Saturday", open: "09:00", close: "20:00", closed: false },
    { day: "Sunday", open: "", close: "", closed: true },
  ],
};

/* ───────────────────────────────────────────────
   Page Component
   ─────────────────────────────────────────────── */

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [homeData, setHomeData] = useState(initialHomeData);
  const [servicesData, setServicesData] = useState(initialServicesData);
  const [galleryData, setGalleryData] = useState(initialGalleryData);
  const [blogData, setBlogData] = useState(initialBlogData);
  const [settingsData, setSettingsData] = useState(initialSettingsData);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1500);
  };

  const renderEditor = () => {
    switch (activeTab) {
      case "home":
        return <HomePageEditor data={homeData} onChange={setHomeData} />;
      case "services":
        return <ServicesPageEditor data={servicesData} onChange={setServicesData} />;
      case "gallery":
        return <GalleryPageEditor data={galleryData} onChange={setGalleryData} />;
      case "blog":
        return <BlogPageEditor data={blogData} onChange={setBlogData} />;
      case "settings":
        return <GlobalSettingsEditor data={settingsData} onChange={setSettingsData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen relative">
        {/* Topbar */}
        <header className="flex justify-between items-center w-full px-4 pl-14 md:px-8 py-4 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black tracking-widest text-white uppercase font-headline">
              Website Content
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {lastSaved && (
              <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-on-surface-variant">
                <span className="w-2 h-2 bg-[#10b981]" />
                Saved {lastSaved}
              </span>
            )}
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <AdminUserBadge />
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="px-8 border-b border-white/5 bg-background/40 backdrop-blur-sm sticky top-[65px] z-40">
          <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="p-8 pb-28">{renderEditor()}</div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 right-0 left-64 z-50 bg-surface-container/90 backdrop-blur-xl border-t border-white/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary animate-pulse" />
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Unsaved Changes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-surface-container border border-outline-variant/20 hover:border-primary hover:text-primary text-on-surface-variant transition-colors font-headline font-bold py-3 px-6 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">undo</span>
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`font-headline font-bold py-3 px-8 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform ${
                saving
                  ? "bg-primary/50 text-on-primary-fixed cursor-wait"
                  : "bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed shadow-[0_0_30px_rgba(255,143,115,0.3)]"
              }`}
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
