"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const resolveI18n = (val) => ({
  en: typeof val === 'object' && val !== null ? val.en || '' : val || '',
  ar: typeof val === 'object' && val !== null ? val.ar || '' : ''
});

export default function ServiceForm({ initialData = {} }) {
  const router = useRouter();
  const isEdit = !!initialData._id;

  const [formData, setFormData] = useState({
    title: resolveI18n(initialData.title),
    price: initialData.price || "",
    category: resolveI18n(initialData.category),
    description: resolveI18n(initialData.description),
    metaTitle: resolveI18n(initialData.metaTitle),
    metaDescription: resolveI18n(initialData.metaDescription),
    metaKeywords: initialData.metaKeywords?.join(", ") || "",
    status: initialData.status || "draft",
    images: initialData.images || [],
    previousImages: initialData.images || [],
    removedImagePublicIds: [],
    buttonName: resolveI18n(initialData.buttonName),
    stats: (initialData.stats || []).map(s => ({
      label: resolveI18n(s.label),
      value: resolveI18n(s.value)
    })),
    processSteps: (initialData.processSteps || []).map(p => ({
      title: resolveI18n(p.title),
      desc: resolveI18n(p.desc)
    })),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleI18nChange = (field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    const toastId = toast.loading("Translating to Arabic...");
    try {
      const translateText = async (text) => {
        if (!text) return "";
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, target: "ar" })
        });
        const data = await res.json();
        return data.translatedText || "";
      };

      const [arTitle, arDesc, arMetaTitle, arButton] = await Promise.all([
        translateText(formData.title.en),
        translateText(formData.description.en),
        translateText(formData.metaTitle.en),
        translateText(formData.buttonName.en),
      ]);

      const translatedStats = await Promise.all(formData.stats.map(async (s) => ({
        label: { ...s.label, ar: await translateText(s.label.en) },
        value: { ...s.value, ar: await translateText(s.value.en) }
      })));

      const translatedProcess = await Promise.all(formData.processSteps.map(async (p) => ({
        title: { ...p.title, ar: await translateText(p.title.en) },
        desc: { ...p.desc, ar: await translateText(p.desc.en) }
      })));

      setFormData(prev => ({
        ...prev,
        title: { ...prev.title, ar: arTitle },
        description: { ...prev.description, ar: arDesc },
        metaTitle: { ...prev.metaTitle, ar: arMetaTitle },
        buttonName: { ...prev.buttonName, ar: arButton },
        stats: translatedStats,
        processSteps: translatedProcess
      }));
      toast.success("Service Auto-Translated successfully", { id: toastId });
    } catch {
      toast.error("Translation failed", { id: toastId });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleArrayI18nChange = (field, index, key, lang, val) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = { 
        ...newArray[index], 
        [key]: { ...newArray[index][key], [lang]: val } 
      };
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], emptyItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (status = "active") => {
    if (!formData.title.en) {
      return toast.error("English Service title is required");
    }
    
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        status: status.toLowerCase(),
        metaKeywords: formData.metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
        slug: formData.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      };

      if (isEdit) {
        await api.put(`/admin/services/${initialData._id}`, payload);
        toast.success("Service updated successfully");
      } else {
        await api.post("/admin/services", payload);
        toast.success("Service created successfully");
      }
      router.push("/admin/services");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 md:gap-10">
      {/* Left Column */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 md:gap-10">
        {/* Core Info */}
        <section className="flex flex-col gap-6 md:gap-8 bg-surface-container p-8 md:p-10 border border-outline-variant/15">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-label text-primary uppercase tracking-[0.2em] font-bold">
                01. Service Essentials
              </span>
              <button 
                type="button" 
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="text-primary hover:brightness-110 text-xs font-label font-bold uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">translate</span>
                Auto-Translate AR
              </button>
            </div>
            <div className="h-[1px] w-12 bg-primary" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Service Title (EN)
                </label>
                <input
                  name="title.en"
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline transition-all focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                  placeholder="e.g. Stage 2 Performance Remap"
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleI18nChange('title', 'en', e.target.value)}
                />
              </div>
              <div className="group relative">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Service Title (AR)
                </label>
                <input
                  name="title.ar"
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline transition-all focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                  placeholder="عنوان الخدمة"
                  type="text"
                  value={formData.title.ar}
                  onChange={(e) => handleI18nChange('title', 'ar', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Base Price (AED)
                </label>
                <div className="relative">
                  <input
                    name="price"
                    className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                    placeholder="2,500"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-label">
                    AED
                  </span>
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 focus:bg-surface-bright border-b-2 border-transparent focus:border-primary appearance-none cursor-pointer"
                  value={formData.category.en}
                  onChange={(e) => {
                    const dict = { performance: 'أداء', aesthetics: 'جماليات', maintenance: 'صيانة', protection: 'حماية' };
                    setFormData(prev => ({ ...prev, category: { en: e.target.value, ar: dict[e.target.value] || e.target.value } }));
                  }}
                >
                  <option value="performance">Performance Tuning</option>
                  <option value="aesthetics">Aesthetics &amp; Body</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="protection">Protection</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Service Description (EN)
                </label>
                <textarea
                  name="description.en"
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary resize-none"
                  placeholder="Describe the precision and performance gains..."
                  rows={6}
                  value={formData.description.en}
                  onChange={(e) => handleI18nChange('description', 'en', e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Service Description (AR)
                </label>
                <textarea
                  name="description.ar"
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary resize-none"
                  placeholder="وصف الخدمة..."
                  rows={6}
                  value={formData.description.ar}
                  onChange={(e) => handleI18nChange('description', 'ar', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Call-to-Action Text (EN)
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                  placeholder="e.g. Schedule Remap"
                  type="text"
                  value={formData.buttonName.en}
                  onChange={(e) => handleI18nChange('buttonName', 'en', e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Call-to-Action Text (AR)
                </label>
                <input
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                  placeholder="نص الزر"
                  type="text"
                  value={formData.buttonName.ar}
                  onChange={(e) => handleI18nChange('buttonName', 'ar', e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        <section className="flex flex-col gap-6 md:gap-8 bg-surface-container border-l-2 border-primary p-8 md:p-10">
          <div className="flex flex-col gap-2 mb-2">
            <span className="text-xs font-label text-primary uppercase tracking-[0.2em] font-bold">
              02. Key Metrics &amp; Process
            </span>
          </div>

          {/* Stats Builder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-black/10 pb-2">
              <h4 className="font-headline font-bold uppercase tracking-widest">Key Statistics</h4>
              {formData.stats.length < 4 && (
                <button type="button" onClick={() => addArrayItem('stats', { label: {en:'', ar:''}, value: {en:'', ar:''} })} className="text-xs font-label text-primary uppercase font-bold tracking-widest flex items-center gap-1 hover:brightness-110">
                  <span className="material-symbols-outlined text-sm">add</span> Add Stat
                </button>
              )}
            </div>
            {formData.stats.map((stat, i) => (
              <div key={i} className="flex gap-4 items-center bg-surface-container-highest p-4">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <input className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-0" placeholder="Value (EN)" value={stat.value.en} onChange={(e) => handleArrayI18nChange('stats', i, 'value', 'en', e.target.value)} />
                    <input dir="rtl" className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-0" placeholder="القيمة (AR)" value={stat.value.ar} onChange={(e) => handleArrayI18nChange('stats', i, 'value', 'ar', e.target.value)} />
                  </div>
                  <div className="flex gap-3">
                    <input className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-0" placeholder="Label (EN)" value={stat.label.en} onChange={(e) => handleArrayI18nChange('stats', i, 'label', 'en', e.target.value)} />
                    <input dir="rtl" className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-0" placeholder="العنوان (AR)" value={stat.label.ar} onChange={(e) => handleArrayI18nChange('stats', i, 'label', 'ar', e.target.value)} />
                  </div>
                </div>
                <button type="button" onClick={() => removeArrayItem('stats', i)} className="text-error opacity-60 hover:opacity-100 p-2">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
            {formData.stats.length === 0 && <p className="text-xs text-on-surface-variant font-label uppercase">No stats added yet. Leave empty to hide this section.</p>}
          </div>

          {/* Process Builder */}
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center border-b border-black/10 pb-2">
              <h4 className="font-headline font-bold uppercase tracking-widest">The Process Timeline</h4>
              {formData.processSteps.length < 4 && (
                <button type="button" onClick={() => addArrayItem('processSteps', { title: {en:'', ar:''}, desc: {en:'', ar:''} })} className="text-xs font-label text-primary uppercase font-bold tracking-widest flex items-center gap-1 hover:brightness-110">
                  <span className="material-symbols-outlined text-sm">add</span> Add Step
                </button>
              )}
            </div>
            {formData.processSteps.map((step, i) => (
              <div key={i} className="bg-surface-container-highest p-4 flex gap-4">
                <div className="font-headline font-black text-2xl text-outline-variant">{`0${i+1}`}</div>
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <input className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-transparent" placeholder="Step Title (EN)" value={step.title.en} onChange={(e) => handleArrayI18nChange('processSteps', i, 'title', 'en', e.target.value)} />
                    <input dir="rtl" className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-transparent" placeholder="العنوان (AR)" value={step.title.ar} onChange={(e) => handleArrayI18nChange('processSteps', i, 'title', 'ar', e.target.value)} />
                  </div>
                  <div className="flex gap-3">
                    <textarea className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-transparent resize-none" placeholder="Step decription (EN)..." rows={2} value={step.desc.en} onChange={(e) => handleArrayI18nChange('processSteps', i, 'desc', 'en', e.target.value)} />
                    <textarea dir="rtl" className="flex-1 bg-white border border-outline-variant/20 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-transparent resize-none" placeholder="الوصف (AR)..." rows={2} value={step.desc.ar} onChange={(e) => handleArrayI18nChange('processSteps', i, 'desc', 'ar', e.target.value)} />
                  </div>
                </div>
                <button type="button" onClick={() => removeArrayItem('processSteps', i)} className="text-error opacity-60 hover:opacity-100 items-start p-2">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
            {formData.processSteps.length === 0 && <p className="text-xs text-on-surface-variant font-label uppercase">No process steps added yet. Leave empty to hide this section.</p>}
          </div>
        </section>

        {/* SEO Section */}
        <section className="flex flex-col gap-6 md:gap-8 bg-surface-container-low p-8 md:p-10 border border-outline-variant/10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-label text-on-surface-variant uppercase tracking-[0.2em] font-bold">
              03. Search Optimization
            </span>
            <div className="h-[1px] w-12 bg-outline-variant" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="group">
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Meta Title (EN)
              </label>
              <input
                className="w-full mb-4 bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                placeholder="Service SEO Title"
                type="text"
                value={formData.metaTitle.en}
                onChange={(e) => handleI18nChange('metaTitle', 'en', e.target.value)}
              />
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Meta Title (AR)
              </label>
              <input
                dir="rtl"
                className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                placeholder="عنوان السيو"
                type="text"
                value={formData.metaTitle.ar}
                onChange={(e) => handleI18nChange('metaTitle', 'ar', e.target.value)}
              />
            </div>
            <div className="group">
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Meta Keywords
              </label>
              <input
                name="metaKeywords"
                className="w-full bg-surface-container-highest border-none p-4 text-black focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                placeholder="Dubai, tuning, performance, garage..."
                type="text"
                value={formData.metaKeywords}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 md:gap-8">
        {/* Image Uploader */}
        <div className="bg-surface-container p-6 md:p-8 border border-outline-variant/15">
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-xs font-label text-primary uppercase tracking-[0.2em] font-bold">
              Media Deck
            </span>
            <div className="h-[1px] w-8 bg-primary" />
          </div>
          <ImageUploader
            aspectClass="aspect-square"
            hint="PNG, JPG, MP4, WEBM up to 50MB"
            onUploadSuccess={handleImageUpload}
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formData.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center group"
              >
                {typeof img === "string" && img.match(/\.(mp4|webm|mov)(\?|#|$)/i) ? (
                  <video src={img} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <img src={img} alt="Service" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
            {formData.images.length < 5 && (
              <div className="aspect-square bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center opacity-50">
                <span className="material-symbols-outlined text-outline-variant text-sm">
                  image
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Publishing Card */}
        <div className="bg-surface-container-highest p-6 md:p-8 border-t-4 border-primary shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <h3 className="font-headline text-lg font-bold uppercase tracking-widest text-black mb-6">
            Service Velocity
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-3 border-b border-black/5">
              <span className="text-xs font-label text-on-surface-variant uppercase">
                Visibility
              </span>
              <span className="text-xs font-label text-black uppercase font-bold">
                Hidden
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-black/5">
              <span className="text-xs font-label text-on-surface-variant uppercase">
                Created By
              </span>
              <span className="text-xs font-label text-black uppercase font-bold">
                Admin
              </span>
            </div>
          </div>
          <div className="mt-8 md:mt-10 flex flex-col gap-3">
            <button 
              onClick={() => handleSave("active")}
              disabled={isSaving}
              className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-label text-xs tracking-[0.2em] uppercase font-black py-4 md:py-5 transition-all active:scale-95 shadow-[0_10px_20px_rgba(255,143,115,0.15)] disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? "Saving..." : isEdit ? "Update Service" : "Publish Service"}
            </button>
            <button 
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="w-full bg-secondary-container text-on-surface font-label text-xs tracking-[0.2em] uppercase font-bold py-4 md:py-5 hover:bg-surface-bright transition-all border border-outline-variant/20 disabled:opacity-50 disabled:cursor-not-allowed">
              Save Draft
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant uppercase text-center mt-6 tracking-widest opacity-60">
            Last saved: Just now
          </p>
        </div>

        {/* Alert */}
        <div className="bg-error-container/10 border-l-2 border-error p-4 md:p-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-lg">
              error
            </span>
            <div>
              <p className="text-xs font-label uppercase font-bold text-on-error-container tracking-wider">
                Missing Engine Data
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase mt-1">
                Add technical specs to improve conversion rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
