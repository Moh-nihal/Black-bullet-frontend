"use client";

import { useState } from "react";

export default function FormSection({ title, icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="glass-panel border border-white/5 overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">
              {icon}
            </span>
          </div>
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-black">
            {title}
          </h3>
        </div>
        <span
          className={`material-symbols-outlined text-on-surface-variant text-lg transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 pt-2 space-y-6 border-t border-white/5">
          {children}
        </div>
      </div>
    </section>
  );
}
