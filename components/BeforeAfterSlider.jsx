"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";

export default function BeforeAfterSlider({ data }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const activePointerId = useRef(null);

  const beforeSrc = data?.beforeImage;
  const afterSrc = data?.afterImage;

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
      // Older browsers may throw; drag still works within the element.
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

  if (!beforeSrc || !afterSrc) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-surface-container-low overflow-hidden">
      {(data?.heading || data?.accentWord || data?.subtitle) && (
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 mb-12 md:mb-16">
          {(data?.heading || data?.accentWord) && (
            <h2 className="font-headline font-black text-[clamp(28px,4vw,48px)] uppercase tracking-tighter text-black">
              {data?.heading ? `${data.heading} ` : null}
              {data?.accentWord ? <span className="text-primary">{data.accentWord}</span> : null}
            </h2>
          )}
          {data?.subtitle && (
            <p className="text-on-surface-variant mt-4 font-body text-[clamp(14px,1.2vw,18px)]">{data.subtitle}</p>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative w-full h-[350px] md:h-[600px] cursor-col-resize select-none touch-none"
        onPointerDown={beginDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onPointerMove={onPointerMove}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={afterSrc}
            alt={data?.afterLabel || ""}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized={typeof afterSrc === "string" && afterSrc.startsWith("http")}
          />
          {data?.afterLabel ? (
            <div className="absolute top-6 md:top-10 right-6 md:right-10 bg-primary text-white px-4 md:px-6 py-2 font-headline font-black text-xs md:text-sm uppercase tracking-[0.2em]">
              {data.afterLabel}
            </div>
          ) : null}
        </div>

        <div
          className="absolute inset-0 z-10"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <Image
            src={beforeSrc}
            alt={data?.beforeLabel || ""}
            fill
            className="object-cover grayscale brightness-75"
            sizes="100vw"
            unoptimized={typeof beforeSrc === "string" && beforeSrc.startsWith("http")}
          />
          {data?.beforeLabel ? (
            <div className="absolute top-6 md:top-10 left-6 md:left-10 bg-black text-white px-4 md:px-6 py-2 font-headline font-black text-xs md:text-sm uppercase tracking-[0.2em]">
              {data.beforeLabel}
            </div>
          ) : null}
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-primary z-20 shadow-[0_0_20px_rgba(220,0,0,0.6)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_4px_15px_rgba(220,0,0,0.4)]">
            <span className="material-symbols-outlined text-white text-lg md:text-2xl">
              unfold_more_double
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
