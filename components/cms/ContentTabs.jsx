"use client";

const tabs = [
  { id: "home", label: "Home Page", icon: "home" },
  { id: "services", label: "Services", icon: "build" },
  { id: "gallery", label: "Gallery", icon: "photo_library" },
  { id: "blog", label: "Blog", icon: "article" },
  { id: "settings", label: "Global Settings", icon: "settings" },
];

export default function ContentTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-headline font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              active
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:bg-white/5 hover:text-black border-b-2 border-transparent"
            }`}
          >
            <span
              className="material-symbols-outlined text-base"
              style={
                active
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
