"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";

import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AdminBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const buildQuery = () => {
    let q = "/admin/blog?limit=50";
    if (searchQuery) q += `&search=${encodeURIComponent(searchQuery)}`;
    if (statusFilter) q += `&status=${encodeURIComponent(statusFilter)}`;
    return q;
  };

  const { data, error, isLoading, mutate } = useSWR(buildQuery(), fetcher);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await api.delete(`/admin/blog/${id}`);
      toast.success("Blog post deleted successfully");
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete blog post");
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface-dim min-h-screen">
        {/* Topbar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-4 pl-14 md:px-8 lg:px-10 py-4 md:py-6 lg:py-8 sticky top-0 z-30 bg-background/60 backdrop-blur-xl border-b border-white/5 gap-4">
          <div className="flex flex-col w-full md:w-auto">
            <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-widest uppercase text-on-surface leading-tight">Content Engine</h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-2">
              <span className="text-[10px] md:text-xs font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Active Publications: {data?.data?.filter(b => b.status === 'published').length || 0}</span>
              <span className="w-1 h-1 bg-primary rounded-full hidden md:block" />
              <span className="text-[10px] md:text-xs font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Drafts: {data?.data?.filter(b => b.status !== 'published').length || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="bg-surface-container-highest border-none text-xs font-label tracking-widest py-3 pl-10 pr-4 w-64 focus:ring-0 placeholder:text-outline" 
                placeholder="SEARCH ARTICLES..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/admin/blog/new" className="bg-gradient-to-br from-primary to-primary-dim px-4 md:px-6 lg:px-8 py-3 font-label font-black text-on-primary-fixed uppercase tracking-tighter flex items-center justify-center gap-2 w-full md:w-auto">
              <span className="material-symbols-outlined text-lg">post_add</span>
              Create Post
            </Link>
          </div>
        </header>

        <section className="p-8 lg:p-10">
          {/* Stats Banner */}
          <div className="grid grid-cols-12 gap-6 mb-12">
            <div className="col-span-12 md:col-span-8 bg-surface-container p-6 lg:p-8 flex flex-col justify-between border-l-4 border-primary">
              <div>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-2">Performance Summary</p>
                <h3 className="font-headline text-xl lg:text-2xl font-bold uppercase italic">Monthly Engagement Growth +14.2%</h3>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-6 sm:gap-8 lg:gap-12 mt-8">
                <div className="w-[45%] sm:w-auto"><p className="text-2xl lg:text-3xl font-headline font-black">12.4k</p><p className="text-[10px] font-label text-on-surface-variant uppercase mt-1">Total Views</p></div>
                <div className="w-[45%] sm:w-auto"><p className="text-2xl lg:text-3xl font-headline font-black">4.8k</p><p className="text-[10px] font-label text-on-surface-variant uppercase mt-1">Reading Time (Min)</p></div>
                <div className="w-[45%] sm:w-auto"><p className="text-2xl lg:text-3xl font-headline font-black">890</p><p className="text-[10px] font-label text-on-surface-variant uppercase mt-1">New Leads</p></div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 bg-surface-container-highest p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <p className="font-label text-[10px] text-primary uppercase tracking-widest mb-4 z-10">System Status</p>
              <div className="w-20 h-20 lg:w-24 lg:h-24 border-4 border-primary-dim border-t-transparent rounded-full flex items-center justify-center mb-4 z-10">
                <span className="font-headline text-xl font-black">100%</span>
              </div>
              <p className="text-xs font-label uppercase tracking-widest z-10">Sync Healthy</p>
            </div>
          </div>

          {/* Published Feed */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4 md:mb-8">
            <h4 className="font-headline text-lg md:text-xl font-bold uppercase tracking-widest border-b-2 border-primary-dim pb-2 inline-block">Published Feed</h4>
            <div className="flex gap-4 w-full sm:w-auto">
              <select 
                className="text-[10px] font-label uppercase tracking-widest px-4 py-2 bg-surface-container-high border border-outline-variant/20 hover:bg-surface-variant transition-colors focus:ring-1 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin" />
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-label uppercase">
                No blog posts found.
              </div>
            ) : (
              data?.data?.map((card) => {
                const isDraft = card.status !== "published";
                return (
                  <div key={card._id} className={`group bg-surface-container relative ${isDraft ? "border border-white/5" : ""}`}>
                    <div className={`aspect-video overflow-hidden relative ${isDraft ? "opacity-60" : ""}`}>
                      <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                        {card.image ? (
                          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">{isDraft ? "edit_document" : "image"}</span>
                        )}
                      </div>
                      {!isDraft && card.category && (
                        <div className="absolute top-0 right-0 p-4">
                          <span className="bg-primary text-on-primary-fixed text-[10px] font-black uppercase px-3 py-1 tracking-widest">{card.category}</span>
                        </div>
                      )}
                      {isDraft && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant">edit_document</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">calendar_today</span>{new Date(card.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">visibility</span>{card.views || 0}</span>
                      </div>
                      <h5 className={`font-headline text-lg font-bold uppercase mb-4 group-hover:text-primary transition-colors leading-tight ${isDraft ? "text-on-surface-variant/60" : ""}`}>{card.title}</h5>
                      <p className={`text-sm ${isDraft ? "text-on-surface-variant/40" : "text-on-surface-variant"} line-clamp-2 mb-8 font-light`}>{card.shortDesc || "No description provided."}</p>
                      <div className="flex border-t border-white/5 pt-6 gap-2">
                        <Link href={`/admin/blog/new?id=${card._id}`} className="flex-1 bg-surface-container-highest py-3 font-label text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary-fixed transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-sm">edit</span> Edit
                        </Link>
                        <button onClick={() => handleDelete(card._id)} className="px-4 bg-surface-container-highest py-3 font-label text-[10px] uppercase tracking-widest hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center group-button">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 gap-6">
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-highest text-primary font-label text-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low hover:bg-surface-container-highest transition-colors font-label text-sm">2</button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low hover:bg-surface-container-highest transition-colors font-label text-sm">3</button>
              <span className="w-10 h-10 flex items-center justify-center">...</span>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low hover:bg-surface-container-highest transition-colors font-label text-sm">8</button>
            </div>
            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant">Showing {data?.data?.length || 0} of {data?.pagination?.total || 0} Articles</p>
          </div>
        </section>
      </main>
    </>
  );
}
