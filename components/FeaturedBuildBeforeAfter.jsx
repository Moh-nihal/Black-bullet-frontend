"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export default function FeaturedBuildBeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before image",
  afterAlt = "After image",
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const activePointerId = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPos(percent);
  }, []);

  const beginDrag = (e) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    activePointerId.current = e.pointerId ?? null;
    try {
      if (e.pointerId != null) containerRef.current.setPointerCapture(e.pointerId);
    } catch {
      // noop
    }
    if (typeof e.clientX === "number") handleMove(e.clientX);
  };

  const endDrag = (e) => {
    if (!containerRef.current) return;
    if (activePointerId.current != null && e.pointerId != null && e.pointerId !== activePointerId.current) return;
    isDragging.current = false;
    activePointerId.current = null;
    try {
      if (e.pointerId != null) containerRef.current.releasePointerCapture(e.pointerId);
    } catch {
      // noop
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    if (activePointerId.current != null && e.pointerId != null && e.pointerId !== activePointerId.current) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video group overflow-hidden bg-surface-container select-none touch-none cursor-col-resize"
      onPointerDown={beginDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onPointerMove={onPointerMove}
      role="application"
      aria-label="Before and after image slider"
    >
      {/* Base (After) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={typeof afterSrc === "string" && (afterSrc.startsWith("http://") || afterSrc.startsWith("https://"))}
      />

      {/* Reveal (Before) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover grayscale brightness-75"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={typeof beforeSrc === "string" && (beforeSrc.startsWith("http://") || beforeSrc.startsWith("https://"))}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      {/* Slider line + handle */}
      <div
        className="absolute inset-y-0 w-1 bg-primary z-10"
        style={{ left: `${sliderPos}%` }}
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-primary text-on-primary-fixed flex items-center justify-center rounded-full shadow-2xl">
          <span className="material-symbols-outlined text-[1.2rem]">unfold_more</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-black/70 backdrop-blur-sm px-3 py-1 font-label text-[10px] font-black uppercase tracking-widest text-white pointer-events-none">
        Before
      </div>
      <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-primary px-3 py-1 font-label text-[10px] font-black uppercase tracking-widest text-on-primary-fixed pointer-events-none">
        After
      </div>
    </div>
  );
}

