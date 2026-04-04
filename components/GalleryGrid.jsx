"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import useSWR from "swr";
import GalleryVideoTile from "@/components/GalleryVideoTile";
import { pickLocalizedText } from "@/lib/pickLocalizedText";
import {
  normalizeGalleryCategories,
  galleryCategoryFilterKey,
  galleryCategoryLabel,
} from "@/lib/normalizeGalleryCategories";

/** English (or only) category value for API query + chip filter match */
function categoryFilterKey(cat) {
  if (cat == null) return "";
  if (typeof cat === "object" && !Array.isArray(cat)) {
    const en = typeof cat.en === "string" ? cat.en.trim() : "";
    if (en) return en;
    return typeof cat.ar === "string" ? cat.ar.trim() : "";
  }
  return String(cat).trim();
}

const API_URL = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001") : "";

const fetcher = (url) => fetch(url, { cache: "no-store" }).then((res) => res.json());

const defaultCategories = ["All Projects", "Detailing", "Wrapping", "Performance"];

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

export default function GalleryGrid({ categories: categoriesProp, items: itemsProp, locale = "en" }) {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = useMemo(() => {
    if (Array.isArray(categoriesProp) && categoriesProp.length > 0) {
      return normalizeGalleryCategories(categoriesProp);
    }
    return normalizeGalleryCategories(defaultCategories);
  }, [categoriesProp]);

  const selectedRow = categories[activeCategory] || categories[0];
  const selectedFilterKey = galleryCategoryFilterKey(selectedRow);
  const isAllProjectsFilter = activeCategory === 0;

  const apiUrl = isAllProjectsFilter
    ? `${API_URL}/api/public/gallery?limit=50`
    : `${API_URL}/api/public/gallery?limit=50&category=${encodeURIComponent(selectedFilterKey)}`;

  const { data, isLoading } = useSWR(apiUrl, fetcher);
  const apiItems = data?.data || [];

  const cmsItems = itemsProp;
  const hasCmsItemsProp = Array.isArray(cmsItems);

  // Map API items to display format, or use CMS items (even if empty), or built-in fallback
  const galleryItemsRaw = apiItems.length > 0
    ? apiItems.map((item, i) => {
        const catKey = categoryFilterKey(item.category);
        return {
          type: item.type || "image",
          src: item.thumbnail || item.url || "/images/gallery-porsche.jpg",
          alt: pickLocalizedText(item.altText, locale) || pickLocalizedText(item.title, locale) || "Gallery image",
          title: pickLocalizedText(item.title, locale),
          subtitle: pickLocalizedText(item.category, locale),
          categoryFilter: catKey,
          className: masonryClasses[i % masonryClasses.length],
          isRemote: !!(item.thumbnail || item.url),
        };
      })
    : hasCmsItemsProp
      ? (cmsItems || []).map((item, i) => ({
          type: item.type || "image",
          src: item.src,
          alt: item.alt || item.title || "Gallery image",
          title: item.title || "",
          subtitle: item.subtitle || "",
          categoryFilter: item.category || "",
          className: item.className || masonryClasses[i % masonryClasses.length],
          isRemote: !!(typeof item.src === "string" && (item.src.startsWith("http://") || item.src.startsWith("https://"))),
        }))
      : fallbackGalleryItems;

  const galleryItems =
    isAllProjectsFilter
      ? galleryItemsRaw
      : galleryItemsRaw.filter((it) => {
          const key = it.categoryFilter ?? "";
          return key === selectedFilterKey;
        });

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 md:gap-4 mb-10 md:mb-12">
        {categories.map((row, i) => (
          <button
            key={`${galleryCategoryFilterKey(row)}-${i}`}
            onClick={() => setActiveCategory(i)}
            className={`px-6 md:px-8 py-3 font-label font-bold uppercase tracking-widest text-xs transition-colors ${
              activeCategory === i
                ? "bg-primary text-on-primary-fixed"
                : "bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/20"
            }`}
          >
            {galleryCategoryLabel(row, locale)}
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
          {galleryItems.length === 0 ? (
            <div className="col-span-full bg-surface-container border border-outline-variant/20 p-10 md:p-14 text-center text-on-surface-variant font-label uppercase tracking-widest">
              No gallery items yet.
            </div>
          ) : galleryItems.map((item, index) => (
            <div key={index} className={`${item.className} relative overflow-hidden bg-surface-container group`}>
              {item.type === "video" || (typeof item.src === "string" && item.src.match(/\.(mp4|webm|mov)(\?|#|$)/i)) ? (
                <GalleryVideoTile src={item.src} title={item.title} subtitle={item.subtitle} />
              ) : (
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
              )}

              {/* Hover Overlay for titled items (images only; videos render their own overlay) */}
              {!(item.type === "video" || (typeof item.src === "string" && item.src.match(/\.(mp4|webm|mov)(\?|#|$)/i))) &&
                item.title &&
                !item.hasStats &&
                item.className !== "masonry-item-wide" && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 md:p-8 flex flex-col justify-end">
                  {item.subtitle && (
                    <p className="font-label text-primary text-xs font-bold uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {item.subtitle}
                    </p>
                  )}
                  <h4 className="font-headline text-lg md:text-xl font-bold italic uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                    {item.title}
                  </h4>
                </div>
              )}

              {/* Always-visible title for wide items */}
              {!(item.type === "video" || (typeof item.src === "string" && item.src.match(/\.(mp4|webm|mov)(\?|#|$)/i))) &&
                item.title &&
                item.className === "masonry-item-wide" && (
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                  <h4 className="font-headline text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
                    {item.title}
                  </h4>
                  <p className="text-xs uppercase tracking-widest font-bold text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
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
