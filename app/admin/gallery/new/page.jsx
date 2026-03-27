"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function NewGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    altText: "",
    sortOrder: "0",
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image/video to upload");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", file); // Backend multer expects 'file' field
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("altText", formData.altText);
      data.append("sortOrder", formData.sortOrder);

      await api.post("/admin/gallery", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Gallery item uploaded successfully");
      router.push("/admin/gallery");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen pb-20">
        <header className="flex justify-between items-center w-full px-4 pl-14 md:px-8 py-4 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="flex flex-col">
            <Link href="/admin/gallery" className="text-on-surface-variant hover:text-white text-[10px] font-headline font-bold uppercase tracking-widest flex items-center gap-1 mb-1 transition-colors">
              <span className="material-symbols-outlined text-[10px]">arrow_back</span>
              Back to Gallery
            </Link>
            <h1 className="text-xl font-black tracking-widest text-white uppercase font-headline">
              Upload Media
            </h1>
          </div>
        </header>

        <section className="p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-surface-container border border-white/5 p-6">
              <h2 className="text-sm font-headline font-black uppercase tracking-widest text-white mb-6 border-b border-white/5 pb-4">
                Basic Info
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. F8 Tributo Satin Wrap"
                    required
                    className="w-full bg-surface-container-highest border-none text-white px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest border-none text-white px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Performance">Performance</option>
                    <option value="Detailing">Detailing</option>
                    <option value="Wrapping">Wrapping</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Details about the project..."
                  className="w-full bg-surface-container-highest border-none text-white px-4 py-3 text-sm font-body focus:ring-1 focus:ring-primary transition-all placeholder:text-outline resize-none"
                />
              </div>
            </div>

            <div className="bg-surface-container border border-white/5 p-6">
              <h2 className="text-sm font-headline font-black uppercase tracking-widest text-white mb-6 border-b border-white/5 pb-4">
                Media File
              </h2>
              <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-outline-variant/30 hover:border-primary/50 cursor-pointer bg-surface-container-highest transition-all relative overflow-hidden group">
                  {preview ? (
                    <>
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-primary px-4 py-2 text-on-primary-fixed text-[10px] font-headline font-bold uppercase tracking-widest">Change File</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-on-surface-variant group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-4xl mb-3 opacity-80">cloud_upload</span>
                      <p className="mb-2 text-sm font-headline font-bold uppercase tracking-wide">
                        Click to upload
                      </p>
                      <p className="text-xs font-body opacity-70">JPG, PNG, WEBP or MP4 (Max: 10MB)</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-4 font-headline font-black text-xs uppercase tracking-widest transition-all ${
                  loading
                    ? "bg-primary/50 text-on-primary-fixed cursor-wait"
                    : "bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed shadow-[0_0_30px_rgba(255,143,115,0.3)] hover:scale-[1.02] active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-base">cloud_done</span>
                )}
                {loading ? "Uploading..." : "Save Gallery Item"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
