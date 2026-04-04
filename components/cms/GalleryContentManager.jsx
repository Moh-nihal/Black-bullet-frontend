"use client";

import FormSection from "./FormSection";
import ImageUpload from "./ImageUpload";
import { normalizeGalleryCategories, galleryCategoryFilterKey } from "@/lib/normalizeGalleryCategories";

const labelClass = "block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2";
const inputClass = "w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-on-surface-variant/70";

export default function GalleryPageEditor({ data, onChange }) {
  const categoryRows = normalizeGalleryCategories(data.categories);

  const updateField = (section, field, value) => {
    onChange({ ...data, [section]: { ...data[section], [field]: value } });
  };

  const updateGalleryItem = (index, field, value) => {
    const items = [...data.gridItems];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, gridItems: items });
  };

  const addGalleryItem = () => {
    onChange({
      ...data,
      gridItems: [
        ...data.gridItems,
        { type: "image", src: "", alt: "", title: "", titleAr: "", subtitle: "", subtitleAr: "", category: "", className: "masonry-item-square" },
      ],
    });
  };

  const removeGalleryItem = (index) => {
    onChange({ ...data, gridItems: data.gridItems.filter((_, i) => i !== index) });
  };

  const updateCategory = (index, lang, value) => {
    const cats = normalizeGalleryCategories(data.categories);
    cats[index] = { ...cats[index], [lang]: value };
    onChange({ ...data, categories: cats });
  };

  const addCategory = () => {
    const cats = normalizeGalleryCategories(data.categories);
    onChange({ ...data, categories: [...cats, { en: "", ar: "" }] });
  };

  const removeCategory = (index) => {
    if (index === 0) return;
    const cats = normalizeGalleryCategories(data.categories);
    onChange({ ...data, categories: cats.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <FormSection title="Gallery Page Header" icon="title">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Page Heading (EN)</label>
            <input type="text" value={data.header.heading} onChange={(e) => updateField("header", "heading", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Page Heading (AR)</label>
            <input type="text" dir="rtl" value={data.header.headingAr || ""} onChange={(e) => updateField("header", "headingAr", e.target.value)} className={inputClass} placeholder="عنوان الصفحة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Accent Word (EN)</label>
            <input type="text" value={data.header.accentWord} onChange={(e) => updateField("header", "accentWord", e.target.value)} className={`${inputClass} text-primary italic`} />
          </div>
          <div>
            <label className={labelClass}>Accent Word (AR)</label>
            <input type="text" dir="rtl" value={data.header.accentWordAr || ""} onChange={(e) => updateField("header", "accentWordAr", e.target.value)} className={`${inputClass} text-primary italic`} placeholder="كلمة مميزة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Subtitle (EN)</label>
            <textarea value={data.header.subtitle} onChange={(e) => updateField("header", "subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Subtitle (AR)</label>
            <textarea dir="rtl" value={data.header.subtitleAr || ""} onChange={(e) => updateField("header", "subtitleAr", e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="العنوان الفرعي..." />
          </div>
        </div>
      </FormSection>

      {/* Featured Build */}
      <FormSection title="Featured Build" icon="star">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Corner badge (EN)</label>
            <input
              type="text"
              value={data.featured.badge || ""}
              onChange={(e) => updateField("featured", "badge", e.target.value)}
              className={inputClass}
              placeholder="e.g. Featured Build"
            />
          </div>
          <div>
            <label className={labelClass}>Corner badge (AR)</label>
            <input
              type="text"
              dir="rtl"
              value={data.featured.badgeAr || ""}
              onChange={(e) => updateField("featured", "badgeAr", e.target.value)}
              className={inputClass}
              placeholder="شارة الزاوية"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload
            label="Before Image"
            hint="Current: /images/gallery-ferrari.jpg"
            value={data.featured.beforeImage}
            aspectClass="aspect-[4/3] max-h-56"
            onChange={(file) => updateField("featured", "beforeImage", file)}
          />
          <ImageUpload
            label="After Image"
            hint="Current: /images/gallery-ferrari.jpg"
            value={data.featured.afterImage}
            aspectClass="aspect-[4/3] max-h-56"
            onChange={(file) => updateField("featured", "afterImage", file)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ImageUpload
              label="Featured Video"
              hint={
                data.featured.videoSrc
                  ? `Current: ${data.featured.videoSrc}`
                  : "Upload an MP4/WEBM/MOV video for the featured build card"
              }
              value={data.featured.videoSrc}
              aspectClass="aspect-[21/9] max-h-56"
              accept="video/mp4,video/webm,video/quicktime"
              emptyLabel="DROP VIDEO HERE"
              onChange={(url) => updateField("featured", "videoSrc", url)}
            />
          </div>
          <div className="bg-surface-container p-4 border-l-2 border-outline-variant/20 flex flex-col justify-center gap-3">
            <div>
              <label className={labelClass}>Video Caption (EN)</label>
              <input type="text" value={data.featured.videoLabel} onChange={(e) => updateField("featured", "videoLabel", e.target.value)} placeholder="e.g. Process: Carbon Kit Install" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Video Caption (AR)</label>
              <input type="text" dir="rtl" value={data.featured.videoLabelAr || ""} onChange={(e) => updateField("featured", "videoLabelAr", e.target.value)} placeholder="تعليق الفيديو" className={inputClass} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Build Title (EN)</label>
            <input type="text" value={data.featured.title} onChange={(e) => updateField("featured", "title", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Build Title (AR)</label>
            <input type="text" dir="rtl" value={data.featured.titleAr || ""} onChange={(e) => updateField("featured", "titleAr", e.target.value)} placeholder="عنوان المشروع" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Build Subtitle (EN)</label>
            <input type="text" value={data.featured.subtitle} onChange={(e) => updateField("featured", "subtitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Build Subtitle (AR)</label>
            <input type="text" dir="rtl" value={data.featured.subtitleAr || ""} onChange={(e) => updateField("featured", "subtitleAr", e.target.value)} placeholder="العنوان الفرعي" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container p-4 border-l-2 border-primary/30 space-y-3">
            <div>
              <label className={labelClass}>HP Gain Label (EN)</label>
              <input type="text" value={data.featured.hpLabel} onChange={(e) => updateField("featured", "hpLabel", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>HP Gain Label (AR)</label>
              <input type="text" dir="rtl" value={data.featured.hpLabelAr || ""} onChange={(e) => updateField("featured", "hpLabelAr", e.target.value)} placeholder="تسمية القدرة الحصانية" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>HP Value</label>
              <input type="text" value={data.featured.hpValue} onChange={(e) => updateField("featured", "hpValue", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>HP Detail (EN)</label>
              <input type="text" value={data.featured.hpDetail} onChange={(e) => updateField("featured", "hpDetail", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>HP Detail (AR)</label>
              <input type="text" dir="rtl" value={data.featured.hpDetailAr || ""} onChange={(e) => updateField("featured", "hpDetailAr", e.target.value)} placeholder="تفاصيل القدرة" className={inputClass} />
            </div>
          </div>
          <div className="bg-surface-container p-4 border-l-2 border-tertiary/30 space-y-3">
            <div>
              <label className={labelClass}>Torque Label (EN)</label>
              <input type="text" value={data.featured.torqueLabel} onChange={(e) => updateField("featured", "torqueLabel", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Torque Label (AR)</label>
              <input type="text" dir="rtl" value={data.featured.torqueLabelAr || ""} onChange={(e) => updateField("featured", "torqueLabelAr", e.target.value)} placeholder="تسمية عزم الدوران" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Torque Value</label>
              <input type="text" value={data.featured.torqueValue} onChange={(e) => updateField("featured", "torqueValue", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Torque Detail (EN)</label>
              <input type="text" value={data.featured.torqueDetail} onChange={(e) => updateField("featured", "torqueDetail", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Torque Detail (AR)</label>
              <input type="text" dir="rtl" value={data.featured.torqueDetailAr || ""} onChange={(e) => updateField("featured", "torqueDetailAr", e.target.value)} placeholder="تفاصيل عزم الدوران" className={inputClass} />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Filter Categories */}
      <FormSection title="Gallery Filter Categories" icon="filter_list">
        <p className="text-[10px] text-on-surface-variant mb-4">
          Row 1 is the &quot;all items&quot; filter. English labels match API category keys; add Arabic for the public /ar gallery.
        </p>
        <div className="space-y-4">
          {categoryRows.map((cat, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-3">
              <span className="font-headline text-[10px] font-bold text-on-surface-variant w-6 shrink-0">{index + 1}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <div>
                  <label className={labelClass}>Label (EN) {index === 0 ? "— locked" : ""}</label>
                  <input
                    type="text"
                    value={cat.en}
                    onChange={(e) => updateCategory(index, "en", e.target.value)}
                    disabled={index === 0}
                    className={`${inputClass} ${index === 0 ? "opacity-90" : ""}`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Label (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={cat.ar}
                    onChange={(e) => updateCategory(index, "ar", e.target.value)}
                    placeholder={index === 0 ? "جميع المشاريع" : "العربية"}
                    className={inputClass}
                  />
                </div>
              </div>
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="w-10 h-10 bg-error/10 hover:bg-error/20 flex items-center justify-center transition-all text-error shrink-0 self-end md:self-center"
                  aria-label="Remove category"
                  title="Remove category"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="mt-4 w-full border-2 border-dashed border-outline-variant/20 hover:border-primary/40 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-all group"
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
          <span className="font-headline text-xs font-bold uppercase tracking-widest">Add Category</span>
        </button>
      </FormSection>

      {/* Gallery Items */}
      <FormSection title="Gallery Grid Items" icon="collections" defaultOpen={false}>
        <div className="space-y-4">
          {data.gridItems.map((item, index) => (
            <div
              key={index}
              className="relative bg-surface-container p-5 group hover:bg-surface-container-high transition-all border-l-2 border-primary/30"
            >
              <div className="absolute -top-3 left-4 px-2 py-0.5 bg-surface-container-highest text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant">
                Item #{index + 1}
              </div>
              <button
                onClick={() => removeGalleryItem(index)}
                className="absolute top-3 right-3 w-7 h-7 bg-error/10 hover:bg-error/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-error"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title (EN)</label>
                  <input type="text" value={item.title} onChange={(e) => updateGalleryItem(index, "title", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Title (AR)</label>
                  <input type="text" dir="rtl" value={item.titleAr || ""} onChange={(e) => updateGalleryItem(index, "titleAr", e.target.value)} placeholder="العنوان" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Subtitle (EN)</label>
                  <input type="text" value={item.subtitle} onChange={(e) => updateGalleryItem(index, "subtitle", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Subtitle (AR)</label>
                  <input type="text" dir="rtl" value={item.subtitleAr || ""} onChange={(e) => updateGalleryItem(index, "subtitleAr", e.target.value)} placeholder="العنوان الفرعي" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Media Type</label>
                  <select
                    value={item.type || "image"}
                    onChange={(e) => updateGalleryItem(index, "type", e.target.value)}
                    className={inputClass}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={item.category || ""}
                    onChange={(e) => updateGalleryItem(index, "category", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Uncategorized</option>
                    {categoryRows
                      .slice(1)
                      .map((c) => {
                        const key = galleryCategoryFilterKey(c);
                        if (!key) return null;
                        return (
                          <option key={key} value={key}>
                            {c.en || key}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    label={item.type === "video" ? "Video File" : "Image"}
                    hint={
                      item.src
                        ? `Current: ${item.src}`
                        : item.type === "video"
                          ? "Upload an MP4/WEBM/MOV video for this grid item"
                          : "Upload an image for this grid item"
                    }
                    value={item.src}
                    aspectClass="aspect-[4/3] max-h-56"
                    accept={
                      item.type === "video"
                        ? "video/mp4,video/webm,video/quicktime"
                        : "image/*"
                    }
                    emptyLabel={item.type === "video" ? "DROP VIDEO HERE" : "DROP IMAGE HERE"}
                    onChange={(url) => updateGalleryItem(index, "src", url)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Layout Size</label>
                  <select value={item.className} onChange={(e) => updateGalleryItem(index, "className", e.target.value)} className={inputClass}>
                    <option value="masonry-item-square">Square</option>
                    <option value="masonry-item-tall">Tall</option>
                    <option value="masonry-item-wide">Wide</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Alt Text (EN)</label>
                  <input type="text" value={item.alt} onChange={(e) => updateGalleryItem(index, "alt", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addGalleryItem}
          className="mt-4 w-full border-2 border-dashed border-outline-variant/20 hover:border-primary/40 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-all group">
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
          <span className="font-headline text-xs font-bold uppercase tracking-widest">Add Gallery Item</span>
        </button>
      </FormSection>

      {/* CTA Section */}
      <FormSection title="Gallery CTA" icon="ads_click" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CTA Heading (EN)</label>
            <input type="text" value={data.cta.heading} onChange={(e) => updateField("cta", "heading", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CTA Heading (AR)</label>
            <input type="text" dir="rtl" value={data.cta.headingAr || ""} onChange={(e) => updateField("cta", "headingAr", e.target.value)} placeholder="عنوان الدعوة" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CTA Accent Word (EN)</label>
            <input type="text" value={data.cta.accentWord} onChange={(e) => updateField("cta", "accentWord", e.target.value)} className={`${inputClass} text-primary italic`} />
          </div>
          <div>
            <label className={labelClass}>CTA Accent Word (AR)</label>
            <input type="text" dir="rtl" value={data.cta.accentWordAr || ""} onChange={(e) => updateField("cta", "accentWordAr", e.target.value)} className={`${inputClass} text-primary italic`} placeholder="كلمة مميزة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Button (EN)</label>
            <input type="text" value={data.cta.primaryText} onChange={(e) => updateField("cta", "primaryText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Primary Button (AR)</label>
            <input type="text" dir="rtl" value={data.cta.primaryTextAr || ""} onChange={(e) => updateField("cta", "primaryTextAr", e.target.value)} placeholder="نص الزر الأساسي" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Secondary Button (EN)</label>
            <input type="text" value={data.cta.secondaryText} onChange={(e) => updateField("cta", "secondaryText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Secondary Button (AR)</label>
            <input type="text" dir="rtl" value={data.cta.secondaryTextAr || ""} onChange={(e) => updateField("cta", "secondaryTextAr", e.target.value)} placeholder="نص الزر الثانوي" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Button Link</label>
            <input type="text" value={data.cta.primaryLink || ""} onChange={(e) => updateField("cta", "primaryLink", e.target.value)} placeholder="/booking or https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Secondary Button Link</label>
            <input type="text" value={data.cta.secondaryLink || ""} onChange={(e) => updateField("cta", "secondaryLink", e.target.value)} placeholder="/services or https://..." className={inputClass} />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
