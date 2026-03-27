import { useState, useRef } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ImageUploader({ label, hint, aspectClass = "aspect-video", onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.media?.url) {
        toast.success("Image uploaded!");
        onUploadSuccess?.(res.data.media.url);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
          {label}
        </label>
      )}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group ${aspectClass} bg-surface-container-highest border-2 border-dashed border-outline-variant/30 hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-primary transition-colors mb-2">
          {isUploading ? "hourglass_empty" : "cloud_upload"}
        </span>
        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
          {isUploading ? "Uploading..." : "Click to Upload Image"}
        </span>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-primary blur-3xl -z-10" />
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
      {hint && (
        <p className="text-[10px] text-on-surface-variant mt-2 font-label uppercase tracking-widest opacity-60">
          {hint}
        </p>
      )}
    </div>
  );
}
