"use client";

import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

const API_URL = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001") : "";

const fetcher = (url) => fetch(url, { cache: "no-store" }).then((res) => res.json());

const categories = ["All Projects", "Detailing", "Wrapping", "Performance"];

// Fallback gallery items
const fallbackGalleryItems = [
  { src: "/images/gallery-porsche.jpg", alt: "Silver Porsche 911 GT3 driving", title: "Track Precision Setup", subtitle: "Porsche 911 GT3", className: "masonry-item-tall" },
  { src: "/images/gallery-steering.jpg", alt: "Close up of a luxury car steering wheel", title: "", subtitle: "", className: "masonry-item-square", grayscale: true },
  { src: "/images/gallery-lambo.jpg", alt: "Lamborghini Aventador front view", title: "THE BULL OF DUBAI", subtitle: "Aventador SVJ Performance Kit", className: "masonry-item-wide" },
  { src: "/images/gallery-amg.jpg", alt: "Mercedes AMG engine details", title: "", subtitle: "", className: "masonry-item-square", hasButton: true },
  { src: "/images/gallery-supra.jpg", alt: "Custom white Supra drifting", title: "Supra MK5 Hybrid", subtitle: "Drift Spec", className: "masonry-item-tall", hasStats: true },
  { src: "/images/gallery-red.jpg", alt: "Red Ferrari detail", title: "", subtitle: "", className: "masonry-item-square" },
  { src: "/images/gallery-exhaust.jpg", alt: "Performance car exhaust with flames", title: "", subtitle: "Live from Workshop", className: "masonry-item-wide", isLive: true },
];

// Masonry class cycle for API items
const masonryClasses = [
  "masonry-item-tall",
  "masonry-item-square",
  "masonry-item-wide",
  "masonry-item-square",
  "masonry-item-tall",
  "masonry-item-square",
  "masonry-item-wide",
];

export default function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState(0);

  // Build API URL with category filter
  const selectedCat = categories[activeCategory];
  const apiUrl = selectedCat === "All Projects"
    ? `${API_URL}/api/public/gallery?limit=50`
    : `${API_URL}/api/public/gallery?limit=50&category=${encodeURIComponent(selectedCat)}`;

  const { data, isLoading } = useSWR(apiUrl, fetcher);
  const apiItems = data?.data || [];

  // Map API items to display format, or use fallback
  const galleryItems = apiItems.length > 0
    ? apiItems.map((item, i) => ({
        src: item.thumbnail || item.url || "/images/gallery-porsche.jpg",
        alt: item.altText || item.title || "Gallery image",
        title: item.title || "",
        subtitle: item.category || "",
        className: masonryClasses[i % masonryClasses.length],
        isRemote: !!(item.thumbnail || item.url),
      }))
    : fallbackGalleryItems;

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 md:gap-4 mb-10 md:mb-12">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(i)}
            className={`px-6 md:px-8 py-3 font-label font-bold uppercase tracking-widest text-xs transition-colors ${
              activeCategory === i
                ? "bg-primary text-on-primary-fixed"
                : "bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Masonry Grid */}
      {!isLoading && (
        <section className="masonry-grid">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`${item.className} relative overflow-hidden bg-surface-container group`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                  item.grayscale
                    ? "grayscale group-hover:grayscale-0 transition-all"
                    : ""
                }`}
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={!!item.isRemote}
              />

              {/* Hover Overlay for titled items */}
              {item.title && !item.hasStats && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 md:p-8 flex flex-col justify-end">
                  {item.subtitle && (
                    <p className="font-label text-primary text-xs font-bold uppercase tracking-widest">
                      {item.subtitle}
                    </p>
                  )}
                  <h4 className="font-headline text-lg md:text-xl font-bold italic uppercase tracking-tighter">
                    {item.title}
                  </h4>
                </div>
              )}

              {/* Always-visible title for wide items */}
              {item.title && item.className === "masonry-item-wide" && (
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                  <h4 className="font-headline text-xl md:text-2xl font-black italic uppercase tracking-tighter">
                    {item.title}
                  </h4>
                  <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                    {item.subtitle}
                  </p>
                </div>
              )}

              {/* View Specs Button */}
              {item.hasButton && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                  <span className="px-6 py-2 border border-white font-label text-[10px] font-bold uppercase tracking-widest text-white">
                    View Specs
                  </span>
                </div>
              )}

              {/* Stats Card */}
              {item.hasStats && (
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-4 md:p-6 bg-surface-container-highest/90 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                    {item.subtitle}
                  </span>
                  <h4 className="font-headline text-lg md:text-xl font-black italic uppercase tracking-tighter mt-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-3 md:mt-4 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">speed</span>
                    <span className="text-[10px] font-bold uppercase">1000 WHP</span>
                  </div>
                </div>
              )}

              {/* Live Badge */}
              {item.isLive && (
                <div className="absolute top-4 md:top-6 left-4 md:left-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-label text-[10px] font-bold text-white uppercase tracking-widest">
                    {item.subtitle}
                  </span>
                </div>
              )}

              {/* Camera icon */}
              {item.grayscale && (
                <div className="absolute top-4 right-4">
                  <span className="material-symbols-outlined text-white/50">
                    photo_camera
                  </span>
                </div>
              )}

              {/* Red gradient overlay */}
              {item.alt?.includes("Red Ferrari") && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              )}
            </div>
          ))}
        </section>
      )}
    </>
  );
}
