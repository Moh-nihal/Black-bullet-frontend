"use client";

import { useEffect, useRef, useState } from "react";

export default function GalleryVideoTile({ src, title, subtitle }) {
  const [open, setOpen] = useState(false);
  const modalVideoRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      try {
        modalVideoRef.current?.play?.();
      } catch {
        // ignore autoplay restrictions
      }
    }, 50);
    return () => clearTimeout(t);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute inset-0 w-full h-full text-left"
        aria-label="Open video preview"
      >
        <video
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          autoPlay
          loop
        />

        {/* Hover overlay + text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {(title || subtitle) && (
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity">
            {subtitle && (
              <p className="font-label text-primary text-xs font-bold uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {subtitle}
              </p>
            )}
            {title && (
              <h4 className="font-headline text-lg md:text-xl font-bold italic uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                {title}
              </h4>
            )}
          </div>
        )}

        {/* Play affordance */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-2xl md:text-3xl filled">
              play_arrow
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Video preview"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-full max-w-5xl bg-black rounded-none border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="text-white/80 text-xs font-headline font-bold uppercase tracking-widest">
                {title || "Video"}
              </div>
              <button
                type="button"
                onClick={close}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="relative w-full aspect-video bg-black">
              <video
                ref={modalVideoRef}
                src={src}
                className="absolute inset-0 w-full h-full object-contain"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

