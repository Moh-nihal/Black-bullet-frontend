"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ImageUpload({
  label,
  hint,
  value,
  onChange,
  aspectClass = "aspect-video",
  accept = "image/*",
  emptyLabel = "DROP IMAGE HERE",
}) {
  const [preview, setPreview] = useState(value || null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

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
        setPreview(res.data.media.url);
        onChange?.(res.data.media.url);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.("");
  };

  return (
    <div>
      {label && (
        <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
          {label}
        </label>
      )}

      {preview ? (
        <div className={`relative group ${aspectClass} bg-surface-container-highest overflow-hidden`}>
          {typeof preview === "string" && preview.match(/\.(mp4|webm|mov)(\?|#|$)/i) ? (
            <video
              src={preview}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              controls
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className={`cursor-pointer bg-primary/20 hover:bg-primary/30 border border-primary/40 px-4 py-2 text-primary text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span className="material-symbols-outlined text-sm">{isUploading ? "sync" : "swap_horiz"}</span>
              {isUploading ? "UPLOADING..." : "REPLACE"}
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <button
              onClick={handleRemove}
              disabled={isUploading}
              className={`bg-error/20 hover:bg-error/30 border border-error/40 px-4 py-2 text-error text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`relative group ${aspectClass} bg-surface-container-highest border-2 border-dashed border-outline-variant/30 hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`material-symbols-outlined text-4xl mb-2 transition-colors ${isUploading ? 'text-primary animate-spin' : 'text-outline-variant group-hover:text-primary'}`}>
            {isUploading ? "sync" : "cloud_upload"}
          </span>
          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            {isUploading ? "UPLOADING..." : emptyLabel}
          </span>
          {!isUploading && (
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mt-1">
              OR CLICK TO BROWSE
            </span>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-primary blur-3xl -z-10" />
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {hint && (
        <p className="text-[10px] text-on-surface-variant mt-2 font-label uppercase tracking-widest opacity-60">
          {hint}
        </p>
      )}
    </div>
  );
}
