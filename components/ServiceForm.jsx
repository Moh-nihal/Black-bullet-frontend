"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ServiceForm({ initialData = {} }) {
  const router = useRouter();
  const isEdit = !!initialData._id;

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    price: initialData.price || "",
    category: initialData.category || "performance",
    description: initialData.description || "",
    metaTitle: initialData.metaTitle || "",
    metaKeywords: initialData.metaKeywords?.join(", ") || "",
    status: initialData.status || "draft",
    images: initialData.images || [],
    previousImages: initialData.images || [],
    removedImagePublicIds: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => {
      const imgToRemove = prev.images[indexToRemove];
      // Note: In a real app we'd extract the public ID to pass into removedImagePublicIds 
      // but the backend uses `collectPublicIdsForCleanup` with previousImages for diffing if partial
      // We will just keep it simple and let the backend diff if needed, or pass empty.
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== indexToRemove),
      };
    });
  };

  const handleSave = async (status = "active") => {
    if (!formData.title) {
      return toast.error("Service title is required");
    }
    
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        status: status.toLowerCase(),
        metaKeywords: formData.metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
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
            <span className="text-xs font-label text-primary uppercase tracking-[0.2em] font-bold">
              01. Service Essentials
            </span>
            <div className="h-[1px] w-12 bg-primary" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="group relative">
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Service Title
              </label>
              <input
                name="title"
                className="w-full bg-surface-container-highest border-none p-4 text-white focus:ring-0 placeholder:text-outline transition-all focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                placeholder="e.g. Stage 2 Performance Remap"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                  Base Price (AED)
                </label>
                <div className="relative">
                  <input
                    name="price"
                    className="w-full bg-surface-container-highest border-none p-4 text-white focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
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
                  className="w-full bg-surface-container-highest border-none p-4 text-white focus:ring-0 focus:bg-surface-bright border-b-2 border-transparent focus:border-primary appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="performance">Performance Tuning</option>
                  <option value="aesthetics">Aesthetics &amp; Body</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="protection">Protection</option>
                </select>
              </div>
            </div>
            <div className="group">
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Service Description
              </label>
              <textarea
                name="description"
                className="w-full bg-surface-container-highest border-none p-4 text-white focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary resize-none"
                placeholder="Describe the precision and performance gains..."
                rows={6}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* SEO Section */}
        <section className="flex flex-col gap-6 md:gap-8 bg-surface-container-low p-8 md:p-10 border border-outline-variant/10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-label text-on-surface-variant uppercase tracking-[0.2em] font-bold">
              02. Search Optimization
            </span>
            <div className="h-[1px] w-12 bg-outline-variant" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="group">
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Meta Title
              </label>
              <input
                name="metaTitle"
                className="w-full bg-surface-container-highest border-none p-4 text-white focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
                placeholder="Service SEO Title"
                type="text"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <label className="block text-xs font-label uppercase text-on-surface-variant mb-3 tracking-widest">
                Meta Keywords
              </label>
              <input
                name="metaKeywords"
                className="w-full bg-surface-container-highest border-none p-4 text-white focus:ring-0 placeholder:text-outline focus:bg-surface-bright border-b-2 border-transparent focus:border-primary"
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
            hint="PNG, JPG up to 10MB"
            onUploadSuccess={handleImageUpload}
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formData.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center group"
              >
                <img src={img} alt="Service" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
          <h3 className="font-headline text-lg font-bold uppercase tracking-widest text-white mb-6">
            Service Velocity
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-xs font-label text-on-surface-variant uppercase">
                Visibility
              </span>
              <span className="text-xs font-label text-white uppercase font-bold">
                Hidden
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-xs font-label text-on-surface-variant uppercase">
                Created By
              </span>
              <span className="text-xs font-label text-white uppercase font-bold">
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
