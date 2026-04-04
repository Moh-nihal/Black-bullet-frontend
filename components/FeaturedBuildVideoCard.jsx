"use client";

import { useEffect, useRef, useState } from "react";

export default function FeaturedBuildVideoCard({
  src,
  label = "",
  posterSrc,
}) {
  const [open, setOpen] = useState(false);
  const modalVideoRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      try {
        modalVideoRef.current?.play?.();
      } catch {
        // ignore autoplay restrictions; user can press play
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
        className="col-span-2 relative aspect-[21/9] bg-surface-container overflow-hidden group text-left"
        aria-label="Open featured build video"
      >
        <video
          src={src}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          muted
          playsInline
          preload="metadata"
          autoPlay
          loop
          poster={posterSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-2xl md:text-3xl filled">
              play_arrow
            </span>
          </div>
        </div>
        {label ? (
          <div className="absolute bottom-3 md:bottom-4 left-4 md:left-6 font-label text-[10px] font-bold uppercase tracking-widest text-white/60 pointer-events-none">
            {label}
          </div>
        ) : null}
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
                {label}
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

