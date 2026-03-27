"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BlogForm({ initialData = {} }) {
  const router = useRouter();
  const isEdit = !!initialData._id;

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    slug: initialData.slug || "",
    category: initialData.category || "Performance Tuning",
    shortDesc: initialData.shortDesc || "",
    content: initialData.content || "",
    tags: initialData.tags?.join(", ") || "",
    metaTitle: initialData.metaTitle || "",
    metaDescription: initialData.metaDescription || "",
    status: initialData.status || "draft",
    image: initialData.image || "",
    ogImage: initialData.ogImage || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title if not explicitly set
  useEffect(() => {
    if (!isEdit && formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      }));
    }
  }, [formData.title, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleOgImageUpload = (url) => {
    setFormData((prev) => ({ ...prev, ogImage: url }));
  };

  const handleSave = async (status = "published") => {
    if (!formData.title) return toast.error("Blog title is required");
    if (!formData.content) return toast.error("Blog content is required");
    
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        status,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
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

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Left Column (2/3) */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {/* Content Basics */}
        <section className="bg-surface-container p-6 md:p-8 border-l-2 border-primary-dim">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="material-symbols-outlined text-primary">
              description
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-wider">
              Content Basics
            </h3>
          </div>
          <div className="space-y-6">
            <div className="group">
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">
                Blog Title
              </label>
              <input
                name="title"
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-headline text-lg p-4 transition-all focus:shadow-[inset_0_-2px_0_#ff8f73]"
                placeholder="e.g. STAGE 3 TUNING: THE BLACK BULLET PROTOCOL"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">
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
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-body text-sm p-4 appearance-none"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Performance Tuning</option>
                  <option>Aesthetic Modifications</option>
                  <option>Workshop News</option>
                  <option>Client Spotlight</option>
                </select>
              </div>
            </div>
            <div className="group">
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">
                Short Description
              </label>
              <textarea
                name="shortDesc"
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#ff8f73]"
                placeholder="A brief tactical overview for the listing feed..."
                rows={3}
                value={formData.shortDesc}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest group-focus-within:text-primary transition-colors">
                  Full Intelligence Content
                </label>
                <div className="flex gap-2">
                  <button
                    className="p-1 text-outline hover:text-white transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">
                      format_bold
                    </span>
                  </button>
                  <button
                    className="p-1 text-outline hover:text-white transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">
                      format_italic
                    </span>
                  </button>
                  <button
                    className="p-1 text-outline hover:text-white transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">
                      link
                    </span>
                  </button>
                </div>
              </div>
              <textarea
                name="content"
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-body text-base p-4 md:p-6 transition-all focus:shadow-[inset_0_-2px_0_#ff8f73] leading-relaxed"
                placeholder="Start documenting the performance journey..."
                rows={12}
                value={formData.content}
                onChange={handleChange}
              />
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
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                placeholder="dubai-tuning, supercar, stage-3, performance"
                type="text"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                SEO Meta Title
              </label>
              <input
                name="metaTitle"
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                placeholder="Meta title for search engines"
                type="text"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 group-focus-within:text-tertiary transition-colors">
                SEO Meta Description
              </label>
              <textarea
                name="metaDescription"
                className="w-full bg-surface-container-highest border-none focus:ring-0 text-white font-body text-sm p-4 transition-all focus:shadow-[inset_0_-2px_0_#e9aaff]"
                placeholder="Discover the technical specifications and performance gains..."
                rows={3}
                value={formData.metaDescription}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right Column (1/3) */}
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
                className="p-3 bg-surface-container-highest text-on-surface-variant hover:text-white hover:bg-surface-bright transition-all"
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
