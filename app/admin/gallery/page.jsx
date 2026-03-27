"use client";

import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function GalleryPage() {
  const { data, error, isLoading, mutate } = useSWR("/admin/gallery", fetcher);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      toast.success("Image deleted successfully");
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete");
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        <header className="flex justify-between items-center w-full px-4 pl-14 md:px-8 py-4 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <h1 className="text-xl font-black tracking-widest text-white uppercase font-headline">
            Gallery Management
          </h1>
          <Link
            href="/admin/gallery/new"
            className="bg-primary hover:bg-primary/90 text-on-primary-fixed px-6 py-2 font-headline font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            Upload Image
          </Link>
        </header>

        <section className="p-8">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin" />
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="bg-surface-container border border-white/5 p-12 text-center text-on-surface-variant font-label uppercase">
              No gallery images found.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.data?.map((item) => (
                <div key={item._id} className="bg-surface-container border border-white/5 group relative">
                  <div className="aspect-square relative overflow-hidden bg-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-10 h-10 bg-error/20 text-error hover:bg-error hover:text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-headline font-bold text-primary tracking-widest uppercase mb-1">
                      {item.category || "Uncategorized"}
                    </p>
                    <h3 className="text-sm font-headline font-black text-white truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
