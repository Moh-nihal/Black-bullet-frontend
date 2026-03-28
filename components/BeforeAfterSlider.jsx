"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";

export default function BeforeAfterSlider({ data }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="py-16 md:py-20 bg-surface-container-lowest overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 mb-12 md:mb-16">
        <h2 className="font-headline font-black text-[clamp(28px,4vw,48px)] uppercase tracking-tighter">
          {data?.heading || "Paint"} <span className="text-primary">{data?.accentWord || "Restoration"}</span>
        </h2>
        <p className="text-on-surface-variant mt-4 font-body text-[clamp(14px,1.2vw,18px)]">
          {data?.subtitle || "Swipe to witness the evolution from desert-worn to showroom-flawless."}
        </p>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-[350px] md:h-[600px] cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <Image
            src={data?.beforeImage || "/images/before-car.jpg"}
            alt="Scratched car surface before restoration"
            fill
            className="object-cover grayscale brightness-50"
            sizes="100vw"
            unoptimized={!!data?.beforeImage}
          />
          <div className="absolute top-6 md:top-10 left-6 md:left-10 glass-panel px-4 md:px-6 py-2 font-headline font-black text-xs md:text-sm uppercase tracking-[0.2em]">
            Before
          </div>
        </div>

        {/* After */}
        <div className="absolute inset-0">
          <Image
            src={data?.afterImage || "/images/after-car.jpg"}
            alt="Polished high gloss car surface after restoration"
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized={!!data?.afterImage}
          />
          <div className="absolute top-6 md:top-10 right-6 md:right-10 glass-panel px-4 md:px-6 py-2 font-headline font-black text-xs md:text-sm uppercase tracking-[0.2em] border-r-4 border-primary">
            After
          </div>
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary z-20 shadow-[0_0_20px_rgba(255,143,115,0.8)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing">
            <span className="material-symbols-outlined text-on-primary-fixed text-lg md:text-2xl">
              unfold_more_double
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
