"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import api from "@/lib/api";
import toast from "react-hot-toast";

const DEFAULT_VARIANT = {
  name: "Variant A",
  weight: 100,
  content: {
    headline: { en: "", ar: "" },
    subHeadline: { en: "", ar: "" },
    heroImage: "",
    whatsappNumber: "971000000000",
    ctaText: { en: "Chat on WhatsApp", ar: "تحدث عبر الواتساب" },
    phoneNumber: "+971000000000",
    callCtaText: { en: "Call Now", ar: "اتصل الان" },
    highlights: ["Highest Quality", "Guaranteed", "Fast Turnaround"], // simple array of strings for MVP
  },
};

export default function LandingPageForm({ initialData }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    status: initialData?.status || "draft",
    utmSource: initialData?.utmSource || "",
    utmCampaign: initialData?.utmCampaign || "",
    metaTitle: initialData?.metaTitle?.en || "",
    metaDescription: initialData?.metaDescription?.en || "",
    variants: initialData?.variants?.length 
      ? initialData.variants 
      : [{ ...DEFAULT_VARIANT }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic, seo, variants

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { ...DEFAULT_VARIANT, name: `Variant ${String.fromCharCode(65 + prev.variants.length)}` },
      ],
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) {
      return toast.error("You must have at least one variant");
    }
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants.splice(index, 1);
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantContentChange = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = {
        ...newVariants[index],
        content: { ...newVariants[index].content, [field]: value },
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantContentI18nChange = (index, field, lang, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const oldVal = newVariants[index].content[field];
      const currentObj = typeof oldVal === 'object' && oldVal !== null ? oldVal : { en: typeof oldVal === 'string' ? oldVal : '', ar: '' };
      
      newVariants[index] = {
        ...newVariants[index],
        content: { 
          ...newVariants[index].content, 
          [field]: { ...currentObj, [lang]: value }
        },
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleAutoTranslate = async (index) => {
    const variant = formData.variants[index];
    const enHeadline = variant.content?.headline?.en || "";
    const enSubHeadline = variant.content?.subHeadline?.en || "";
    const enCtaText = variant.content?.ctaText?.en || "Chat on WhatsApp";
    const enCallCta = variant.content?.callCtaText?.en || "Call Now";

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

      const [arHeadline, arSubHeadline, arCtaText, arCallCta] = await Promise.all([
        translateText(enHeadline),
        translateText(enSubHeadline),
        translateText(enCtaText),
        translateText(enCallCta)
      ]);

      setFormData((prev) => {
        const newVariants = [...prev.variants];
        const v = newVariants[index].content;
        
        v.headline = { ...v.headline, ar: arHeadline };
        v.subHeadline = { ...v.subHeadline, ar: arSubHeadline };
        v.ctaText = { ...v.ctaText, ar: arCtaText };
        v.callCtaText = { ...v.callCtaText, ar: arCallCta };
        
        return { ...prev, variants: newVariants };
      });

      toast.success("Auto-Translate complete.", { id: toastId });
    } catch (err) {
      toast.error("Translation failed.", { id: toastId });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        utmSource: formData.utmSource,
        utmCampaign: formData.utmCampaign,
        metaTitle: { en: formData.metaTitle, ar: formData.metaTitle },
        metaDescription: { en: formData.metaDescription, ar: formData.metaDescription },
        variants: formData.variants,
      };

      if (isEditing) {
        await api.put(`/admin/landing/${initialData._id}`, payload);
        toast.success("Landing page updated!");
      } else {
        await api.post("/admin/landing", payload);
        toast.success("Landing page created!");
        router.push("/admin/landing");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header Tabs */}
      <div className="flex border-b border-outline-variant/50 mb-8 sticky top-0 bg-surface z-10">
        {["basic", "seo", "variants"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 font-label font-bold tracking-widest uppercase text-xs transition-colors border-b-2 ${
              activeTab === tab 
              ? "border-primary text-primary bg-primary/5" 
              : "border-transparent text-on-surface-variant hover:text-black hover:bg-black/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BASIC TAB */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">Campaign Title *</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                placeholder="e.g. Ramadan Supercar Tuning Promo"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">URL Slug *</label>
              <div className="flex bg-surface-container-highest focus-within:ring-1 focus-within:ring-primary transition-all">
                <span className="text-on-surface-variant px-4 py-3 border-r border-outline-variant/30 text-sm">/landing/</span>
                <input
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none text-black px-4 py-3 text-sm font-body focus:ring-0 placeholder:text-on-surface-variant/70"
                  placeholder="ramadan-promo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">UTM Source</label>
              <input
                name="utmSource"
                value={formData.utmSource}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                placeholder="e.g. google, facebook"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">UTM Campaign</label>
              <input
                name="utmCampaign"
                value={formData.utmCampaign}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                placeholder="e.g. spring_sale_2026"
              />
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
            <div className="space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">Meta Title</label>
              <input
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                placeholder="SEO Title (60 chars)"
                maxLength={60}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-label uppercase tracking-widest font-bold">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={4}
                className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70 resize-none"
                placeholder="SEO Description (160 chars)"
                maxLength={160}
              />
            </div>
          </div>
        )}

        {/* VARIANTS TAB */}
        {activeTab === "variants" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {formData.variants.map((variant, index) => (
              <div key={index} className="bg-surface-container border border-outline-variant/30 p-6 relative">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
                  <h3 className="font-headline font-bold text-lg uppercase">Variant #{index + 1}: {variant.name}</h3>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => handleAutoTranslate(index)}
                      disabled={isTranslating}
                      className="text-primary hover:text-primary/80 text-xs font-label font-bold uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">translate</span>
                      {isTranslating ? "Translating..." : "Auto-Translate AR"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-800 text-xs font-label font-bold uppercase tracking-widest flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Variant Settings */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-label uppercase tracking-widest font-bold">Variant Name</label>
                      <input
                        required
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                        className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-label uppercase tracking-widest font-bold">Traffic Weight (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                        className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                      />
                      <p className="text-xs text-on-surface-variant mt-1">Determines how often this variant is shown relative to others.</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                      <h4 className="font-label font-bold text-xs uppercase tracking-widest text-primary">Content Definitions</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Hero Headline (EN)</label>
                          <textarea
                            rows={2}
                            value={variant.content?.headline?.en || (typeof variant.content?.headline === 'string' ? variant.content.headline : '')}
                            onChange={(e) => handleVariantContentI18nChange(index, "headline", "en", e.target.value)}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-on-surface-variant/70"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Hero Headline (AR)</label>
                          <textarea
                            rows={2}
                            value={variant.content?.headline?.ar || ""}
                            onChange={(e) => handleVariantContentI18nChange(index, "headline", "ar", e.target.value)}
                            dir="rtl"
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-on-surface-variant/70"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Sub Headline (EN)</label>
                          <textarea
                            rows={3}
                            value={variant.content?.subHeadline?.en || (typeof variant.content?.subHeadline === 'string' ? variant.content.subHeadline : '')}
                            onChange={(e) => handleVariantContentI18nChange(index, "subHeadline", "en", e.target.value)}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-on-surface-variant/70"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Sub Headline (AR)</label>
                          <textarea
                            rows={3}
                            value={variant.content?.subHeadline?.ar || ""}
                            onChange={(e) => handleVariantContentI18nChange(index, "subHeadline", "ar", e.target.value)}
                            dir="rtl"
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-on-surface-variant/70"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">WhatsApp #</label>
                          <input
                            value={variant.content?.whatsappNumber || ""}
                            onChange={(e) => handleVariantContentChange(index, "whatsappNumber", e.target.value)}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">WhatsApp Button (EN)</label>
                          <input
                            value={variant.content?.ctaText?.en || (typeof variant.content?.ctaText === 'string' ? variant.content.ctaText : "Chat on WhatsApp")}
                            onChange={(e) => handleVariantContentI18nChange(index, "ctaText", "en", e.target.value)}
                            className="w-full mb-2 bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">WhatsApp Button (AR)</label>
                          <input
                            value={variant.content?.ctaText?.ar || ""}
                            onChange={(e) => handleVariantContentI18nChange(index, "ctaText", "ar", e.target.value)}
                            dir="rtl"
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Phone #</label>
                          <input
                            value={variant.content?.phoneNumber || ""}
                            onChange={(e) => handleVariantContentChange(index, "phoneNumber", e.target.value)}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Call Button (EN)</label>
                          <input
                            value={variant.content?.callCtaText?.en || (typeof variant.content?.callCtaText === 'string' ? variant.content.callCtaText : "Call Now")}
                            onChange={(e) => handleVariantContentI18nChange(index, "callCtaText", "en", e.target.value)}
                            className="w-full mb-2 bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                          <label className="block text-xs font-label uppercase tracking-widest font-bold">Call Button (AR)</label>
                          <input
                            value={variant.content?.callCtaText?.ar || ""}
                            onChange={(e) => handleVariantContentI18nChange(index, "callCtaText", "ar", e.target.value)}
                            dir="rtl"
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Component */}
                  <div className="space-y-4">
                    <ImageUploader
                      label="Background Image"
                      onUploadSuccess={(url) => handleVariantContentChange(index, "heroImage", url)}
                      aspectClass="aspect-video"
                    />
                    {variant.content?.heroImage && (
                      <div className="relative aspect-video bg-black/10 overflow-hidden border border-outline-variant/30 group">
                        <img 
                          src={variant.content.heroImage} 
                          alt="Hero Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => handleVariantContentChange(index, "heroImage", "")}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-error font-label font-bold tracking-widest uppercase text-xs"
                        >
                          <span className="material-symbols-outlined text-sm mr-2">delete</span>
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="w-full border-2 border-dashed border-outline hover:border-primary hover:text-primary transition-colors py-8 flex flex-col items-center justify-center text-on-surface-variant gap-2"
            >
              <span className="material-symbols-outlined text-3xl">add_circle</span>
              <span className="font-label font-bold text-xs uppercase tracking-widest">Add A/B Variant</span>
            </button>
          </div>
        )}

        {/* Submit Actions */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-surface border-t border-outline-variant/30 flex justify-end gap-4 z-40 px-8 py-5">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-3 font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant hover:text-black transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="kinetic-gradient px-8 py-3 text-white font-label font-bold tracking-widest uppercase text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
            {isSubmitting ? "Saving..." : "Save Landing Page"}
          </button>
        </div>
      </form>
    </div>
  );
}
