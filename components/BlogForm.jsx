"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const resolveI18n = (val) => ({
  en: typeof val === 'object' && val !== null ? val.en || '' : val || '',
  ar: typeof val === 'object' && val !== null ? val.ar || '' : ''
});

export default function BlogForm({ initialData = {} }) {
  const router = useRouter();
  const isEdit = !!initialData._id;

  const [formData, setFormData] = useState({
    title: resolveI18n(initialData.title),
    slug: initialData.slug || "",
    category: resolveI18n(initialData.category),
    shortDesc: resolveI18n(initialData.shortDesc),
    content: resolveI18n(initialData.content),
    tags: initialData.tags?.join(", ") || "",
    metaTitle: resolveI18n(initialData.metaTitle),
    metaDescription: resolveI18n(initialData.metaDescription),
    status: initialData.status || "draft",
    image: initialData.image || "",
    ogImage: initialData.ogImage || "",
    // New CMS-like fields
    accentPhrase: resolveI18n(initialData.accentPhrase),
    author: initialData.author || "",
    authorTitle: resolveI18n(initialData.authorTitle),
    leadQuote: resolveI18n(initialData.leadQuote),
    calloutTitle: resolveI18n(initialData.calloutTitle),
    contentSections: (initialData.contentSections || []).length
      ? initialData.contentSections.map(s => ({ heading: resolveI18n(s.heading), body: resolveI18n(s.body) }))
      : [{ heading: {en:'', ar:''}, body: {en:'', ar:''} }],
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title if not explicitly set
  useEffect(() => {
    if (!isEdit && formData.title.en && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }, [formData.title.en, isEdit]);

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
    const toastId = toast.loading("Translating Article...");
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

      const [arTitle, arShortDesc, arContent, arMetaTitle, arMetaDesc, arAccent, arAuthTitle, arLead, arCallout] = await Promise.all([
        translateText(formData.title.en),
        translateText(formData.shortDesc.en),
        translateText(formData.content.en),
        translateText(formData.metaTitle.en),
        translateText(formData.metaDescription.en),
        translateText(formData.accentPhrase.en),
        translateText(formData.authorTitle.en),
        translateText(formData.leadQuote.en),
        translateText(formData.calloutTitle.en),
      ]);
      
      const translatedSections = await Promise.all(formData.contentSections.map(async (s) => ({
        heading: { ...s.heading, ar: await translateText(s.heading.en) },
        body: { ...s.body, ar: await translateText(s.body.en) }
      })));

      setFormData(prev => ({
        ...prev,
        title: { ...prev.title, ar: arTitle },
        shortDesc: { ...prev.shortDesc, ar: arShortDesc },
        content: { ...prev.content, ar: arContent },
        metaTitle: { ...prev.metaTitle, ar: arMetaTitle },
        metaDescription: { ...prev.metaDescription, ar: arMetaDesc },
        accentPhrase: { ...prev.accentPhrase, ar: arAccent },
        authorTitle: { ...prev.authorTitle, ar: arAuthTitle },
        leadQuote: { ...prev.leadQuote, ar: arLead },
        calloutTitle: { ...prev.calloutTitle, ar: arCallout },
        contentSections: translatedSections
      }));
      toast.success("Blog Auto-Translated successfully", { id: toastId });
    } catch {
      toast.error("Translation failed", { id: toastId });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleOgImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, ogImage: url }));
  };

  // Content Sections helpers
  const updateSectionI18n = (index, field, lang, value) => {
    setFormData((prev) => {
      const updated = [...prev.contentSections];
      updated[index] = { 
        ...updated[index], 
        [field]: { ...updated[index][field], [lang]: value } 
      };
      return { ...prev, contentSections: updated };
    });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      contentSections: [...prev.contentSections, { heading: {en:'', ar:''}, body: {en:'', ar:''} }],
    }));
  };

  const removeSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (status = "published") => {
    if (!formData.title.en) return toast.error("English Blog title is required");
    if (!formData.content.en && !formData.contentSections.some(s => s.body.en.trim()))
      return toast.error("Blog content is required — fill the main content or add content sections");

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        status,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        contentSections: formData.contentSections.filter(s => s.heading.en.trim() || s.body.en.trim()),
      };

      if (isEdit) {
        await api.put(`/admin/blog/${initialData._id}`, payload);
        toast.success("Blog updated successfully");
      } else {
        await api.post("/admin/blog", payload);
        toast.success("Blog created successfully");
      }
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#ff8f73]";
  const labelClass = "block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors";

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Left Column (2/3) */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {/* Content Basics */}
        <section className="bg-surface-container p-6 md:p-8 border-l-2 border-primary-dim">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">description</span>
              <h3 className="font-headline text-xl font-bold uppercase tracking-wider">Content Basics</h3>
            </div>
            <button 
              type="button" 
              onClick={handleAutoTranslate}
              disabled={isTranslating}
              className="text-primary hover:brightness-110 text-xs font-label font-bold uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">translate</span> Auto-Translate
            </button>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass}>Blog Title (EN)</label>
                <input
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-headline text-lg p-4 transition-all focus:shadow-[inset_0_-2px_0_#ff8f73]"
                  placeholder="e.g. STAGE 3 TUNING"
                  value={formData.title.en}
                  onChange={(e) => handleI18nChange("title", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className={labelClass}>Blog Title (AR)</label>
                <input
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-headline text-lg p-4 transition-all focus:shadow-[inset_0_-2px_0_#ff8f73]"
                  placeholder="عنوان المقال"
                  value={formData.title.ar}
                  onChange={(e) => handleI18nChange("title", "ar", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass}>
                  Accent Phrase (EN) <span className="text-on-surface-variant/50 normal-case font-normal">(italic highlight after title)</span>
                </label>
                <input
                  className={`${inputClass} italic text-primary`}
                  placeholder="e.g. Beyond The Dyno"
                  type="text"
                  value={formData.accentPhrase.en}
                  onChange={(e) => handleI18nChange("accentPhrase", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className={labelClass}>
                  Accent Phrase (AR)
                </label>
                <input
                  dir="rtl"
                  className={`${inputClass} italic text-primary`}
                  placeholder="عبارة مميزة"
                  type="text"
                  value={formData.accentPhrase.ar}
                  onChange={(e) => handleI18nChange("accentPhrase", "ar", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className={labelClass}>
                  Slug (System ID)
                </label>
                <input
                  name="slug"
                  className="w-full bg-surface-container-low border-none focus:ring-0 text-outline font-body text-sm p-4"
                  placeholder="auto-generated-from-title"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>
              <div className="group">
                <label className={labelClass}>Category</label>
                <select
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 appearance-none"
                  value={formData.category.en}
                  onChange={(e) => {
                    const dict = { "Performance Tuning": "تعديل الأداء", "Aesthetic Modifications": "تعديلات جمالية", "Workshop News": "أخبار الورشة", "Client Spotlight": "تسليط الضوء" };
                    setFormData(prev => ({ ...prev, category: { en: e.target.value, ar: dict[e.target.value] || e.target.value } }));
                  }}
                >
                  <option value="Performance Tuning">Performance Tuning</option>
                  <option value="Aesthetic Modifications">Aesthetic Modifications</option>
                  <option value="Workshop News">Workshop News</option>
                  <option value="Client Spotlight">Client Spotlight</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className={labelClass}>
                  Author Name (System)
                </label>
                <input
                  name="author"
                  className={inputClass}
                  placeholder="e.g. Khalid Al-Mansouri"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className={labelClass}>
                  Author Title (EN)
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. Chief Performance Architect"
                  type="text"
                  value={formData.authorTitle.en}
                  onChange={(e) => handleI18nChange("authorTitle", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className={labelClass}>
                  Author Title (AR)
                </label>
                <input
                  dir="rtl"
                  className={inputClass}
                  placeholder="المسمى الوظيفي"
                  type="text"
                  value={formData.authorTitle.ar}
                  onChange={(e) => handleI18nChange("authorTitle", "ar", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass}>Short Description (EN)</label>
                <textarea
                  className={inputClass}
                  placeholder="Tactical overview..."
                  rows={3}
                  value={formData.shortDesc.en}
                  onChange={(e) => handleI18nChange("shortDesc", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className={labelClass}>Short Description (AR)</label>
                <textarea
                  dir="rtl"
                  className={inputClass}
                  placeholder="نظرة عامة..."
                  rows={3}
                  value={formData.shortDesc.ar}
                  onChange={(e) => handleI18nChange("shortDesc", "ar", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Body Content */}
        <section className="bg-surface-container p-6 md:p-8 border-l-2 border-secondary">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="material-symbols-outlined text-secondary">
              edit_note
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-wider">
              Article Body Content
            </h3>
          </div>
          <div className="space-y-6">
            {/* Lead Quote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass.replace('group-focus-within:text-primary', 'group-focus-within:text-secondary')}>
                  Lead Quote (EN)
                </label>
                <textarea
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black italic font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#81c784] resize-none border-l-4 border-l-primary/30"
                  placeholder="Opening quote that sets the tone for the article..."
                  rows={3}
                  value={formData.leadQuote.en}
                  onChange={(e) => handleI18nChange("leadQuote", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className={labelClass.replace('group-focus-within:text-primary', 'group-focus-within:text-secondary')}>
                  Lead Quote (AR)
                </label>
                <textarea
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black italic font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#81c784] resize-none border-l-4 border-l-primary/30"
                  placeholder="الاقتباس الرئيسي..."
                  rows={3}
                  value={formData.leadQuote.ar}
                  onChange={(e) => handleI18nChange("leadQuote", "ar", e.target.value)}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest group-focus-within:text-secondary transition-colors mb-2">
                  Main Content (EN)
                </label>
                <textarea
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-base p-4 transition-all focus:shadow-[inset_0_-2px_0_#81c784] leading-relaxed"
                  placeholder="Start documenting the performance journey..."
                  rows={8}
                  value={formData.content.en}
                  onChange={(e) => handleI18nChange("content", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest group-focus-within:text-secondary transition-colors mb-2">
                  Main Content (AR)
                </label>
                <textarea
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-base p-4 transition-all focus:shadow-[inset_0_-2px_0_#81c784] leading-relaxed"
                  placeholder="توثيق الرحلة..."
                  rows={8}
                  value={formData.content.ar}
                  onChange={(e) => handleI18nChange("content", "ar", e.target.value)}
                />
              </div>
            </div>

            {/* Callout Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass.replace('group-focus-within:text-primary', 'group-focus-within:text-secondary')}>
                  Callout Box Heading (EN) <span className="text-on-surface-variant/50 normal-case font-normal">(highlighted section)</span>
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-headline font-bold text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#81c784]"
                  placeholder="e.g. Key Engineering Focus: Thermal Mitigation"
                  type="text"
                  value={formData.calloutTitle.en}
                  onChange={(e) => handleI18nChange("calloutTitle", "en", e.target.value)}
                />
              </div>
              <div className="group">
                <label className={labelClass.replace('group-focus-within:text-primary', 'group-focus-within:text-secondary')}>
                  Callout Box Heading (AR)
                </label>
                <input
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-headline font-bold text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#81c784]"
                  placeholder="عنوان الصندوق البارز"
                  type="text"
                  value={formData.calloutTitle.ar}
                  onChange={(e) => handleI18nChange("calloutTitle", "ar", e.target.value)}
                />
              </div>
            </div>

            {/* Content Sections (Repeater) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Content Sections <span className="text-on-surface-variant/50 normal-case font-normal">(structured paragraphs)</span>
                </label>
                <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">
                  {formData.contentSections.length} {formData.contentSections.length === 1 ? "section" : "sections"}
                </span>
              </div>
              <div className="space-y-4">
                {formData.contentSections.map((section, index) => (
                  <div key={index} className="bg-surface-container-low p-4 md:p-5 relative group/section border border-outline-variant/10">
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant/60 mr-2">§{index + 1}</span>
                      {formData.contentSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-headline font-bold text-sm px-4 py-3 transition-all focus:shadow-[inset_0_-2px_0_#81c784] placeholder:font-body placeholder:font-normal"
                          placeholder={`Section ${index + 1} heading (EN)`}
                          value={section.heading.en}
                          onChange={(e) => updateSectionI18n(index, "heading", "en", e.target.value)}
                        />
                        <input
                          type="text"
                          dir="rtl"
                          className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-headline font-bold text-sm px-4 py-3 transition-all focus:shadow-[inset_0_-2px_0_#81c784] placeholder:font-body placeholder:font-normal"
                          placeholder={`العنوان الذرعي`}
                          value={section.heading.ar}
                          onChange={(e) => updateSectionI18n(index, "heading", "ar", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea
                          className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm px-4 py-3 transition-all focus:shadow-[inset_0_-2px_0_#81c784] resize-none leading-relaxed"
                          placeholder={`Section ${index + 1} body content (EN)...`}
                          rows={4}
                          value={section.body.en}
                          onChange={(e) => updateSectionI18n(index, "body", "en", e.target.value)}
                        />
                        <textarea
                          dir="rtl"
                          className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm px-4 py-3 transition-all focus:shadow-[inset_0_-2px_0_#81c784] resize-none leading-relaxed"
                          placeholder={`محتوى القسم...`}
                          rows={4}
                          value={section.body.ar}
                          onChange={(e) => updateSectionI18n(index, "body", "ar", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSection}
                className="mt-4 w-full border-2 border-dashed border-outline-variant/20 hover:border-secondary/40 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-secondary transition-all group"
              >
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
                <span className="font-headline text-xs font-bold uppercase tracking-widest">Add Section</span>
              </button>
            </div>
          </div>
        </section>

        {/* SEO Section */}
        <section className="bg-surface-container p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="material-symbols-outlined text-tertiary">
              travel_explore
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-wider">
              Metadata &amp; SEO
            </h3>
          </div>
          <div className="space-y-6">
            <div className="group">
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                Tags (Comma Separated)
              </label>
              <input
                name="tags"
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                placeholder="dubai-tuning, supercar, stage-3, performance"
                type="text"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                  SEO Title (EN)
                </label>
                <input
                  className="w-full mb-4 bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                  value={formData.metaTitle.en}
                  onChange={(e) => handleI18nChange("metaTitle", "en", e.target.value)}
                />
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                  SEO Description (EN)
                </label>
                <textarea
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                  rows={3}
                  value={formData.metaDescription.en}
                  onChange={(e) => handleI18nChange("metaDescription", "en", e.target.value)}
                />
              </div>
              
              <div className="group">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                  SEO Title (AR)
                </label>
                <input
                  dir="rtl"
                  className="w-full mb-4 bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                  value={formData.metaTitle.ar}
                  onChange={(e) => handleI18nChange("metaTitle", "ar", e.target.value)}
                />
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                  SEO Description (AR)
                </label>
                <textarea
                  dir="rtl"
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-black font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                  rows={3}
                  value={formData.metaDescription.ar}
                  onChange={(e) => handleI18nChange("metaDescription", "ar", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column (1/3) — Sidebar (unchanged) */}
      <div className="space-y-6 md:space-y-8">
        {/* Media */}
        <section className="bg-surface-container p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="material-symbols-outlined text-primary">
              photo_library
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-wider">
              Media Assets
            </h3>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div>
              {formData.image ? (
                <div className="relative aspect-video group mb-4">
                  <img src={formData.image} alt="Featured" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData(prev => ({...prev, image: ""}))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">delete</span>
                  </button>
                </div>
              ) : (
                <ImageUploader
                  label="Featured Image"
                  hint="Recommended: 1920x1080px (MAX 2MB)"
                  onUploadSuccess={handleImageUpload}
                />
              )}
            </div>
            <div>
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                Open Graph (Social)
              </label>
                {formData.ogImage ? (
                  <div className="relative w-full h-28 md:h-32 group mb-4">
                    <img src={formData.ogImage} alt="OG" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(prev => ({...prev, ogImage: ""}))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl">delete</span>
                    </button>
                  </div>
                ) : (
                  <ImageUploader
                    hint="Open Graph Image"
                    onUploadSuccess={handleOgImageUpload}
                  />
                )}
            </div>
          </div>
        </section>

        {/* Visibility */}
        <section className="bg-surface-container p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-secondary">
              visibility
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-wider">
              Visibility
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-container-highest/50">
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Post Status
              </span>
              <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant font-label text-[10px] uppercase font-bold tracking-tighter">
                {isEdit ? "Published" : "New Draft"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-highest/50">
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Access Level
              </span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-label text-[10px] uppercase font-bold tracking-tighter">
                Public
              </span>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-outline-variant/20">
            <h4 className="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-4">
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                className="p-3 bg-surface-container-highest text-on-surface-variant hover:text-black hover:bg-surface-bright transition-all"
                onClick={() => handleSave("draft")}
                disabled={isSaving}
              >
                <span className="material-symbols-outlined text-sm">
                  save
                </span>
                <span className="block text-[10px] font-label uppercase font-bold mt-1">
                  Save Draft
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/blog")}
                disabled={isSaving}
                className="p-3 bg-surface-container-highest text-on-surface-variant hover:text-error transition-all"
              >
                <span className="material-symbols-outlined text-sm">
                  close
                </span>
                <span className="block text-[10px] font-label uppercase font-bold mt-1">
                  Cancel
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed uppercase tracking-widest font-bold text-xs hover:shadow-[0_0_20px_rgba(255,143,115,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">publish</span>
              {isSaving ? "Deploying..." : isEdit ? "Update Report" : "Deploy Report"}
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}
