"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AdminLandingPages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const buildQuery = () => {
    let q = "/admin/landing?limit=100";
    if (searchQuery) q += `&search=${encodeURIComponent(searchQuery)}`;
    if (statusFilter) q += `&status=${encodeURIComponent(statusFilter)}`;
    return q;
  };

  const { data, error, isLoading, mutate } = useSWR(buildQuery(), fetcher);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this landing page?")) return;
    try {
      await api.delete(`/admin/landing/${id}`);
      toast.success("Page deleted successfully");
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete");
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        {/* Topbar */}
        <header className="flex flex-wrap justify-between items-center w-full gap-x-4 gap-y-4 px-4 pl-14 md:px-8 lg:px-12 py-4 md:py-6 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="order-1 flex items-center gap-4 md:gap-8 w-auto h-8">
            <h2 className="font-headline text-[15px] md:text-2xl font-black tracking-widest text-black uppercase leading-none mt-1">Landing Pages</h2>
          </div>
          
          <div className="order-last md:order-2 w-full lg:w-auto lg:flex-1 max-w-xl ml-auto grid grid-cols-2 lg:grid-cols-3 gap-2 mt-4 lg:mt-0">
            <div className="relative w-full col-span-2 lg:col-span-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                placeholder="SEARCH PAGES..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-highest border-none text-[10px] md:text-xs text-black pl-8 pr-2 py-2 md:py-2.5 w-full h-full focus:ring-1 focus:ring-primary transition-all font-label uppercase tracking-widest placeholder:text-on-surface-variant/70"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-container-highest border-none text-[10px] md:text-xs text-black xl:pl-4 pl-3 pr-8 py-2 md:py-2.5 h-full focus:ring-1 focus:ring-primary transition-all font-label uppercase tracking-widest"
            >
              <option value="">ALL STATUSES</option>
              <option value="active">ACTIVE</option>
              <option value="draft">DRAFT</option>
              <option value="paused">PAUSED</option>
            </select>
            <Link href="/admin/landing/new" className="w-full h-full bg-primary text-white font-label font-bold text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-center gap-2 hover:bg-primary-dim transition-colors whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>CREATE PAGE</span>
            </Link>
          </div>

          <div className="order-2 sm:order-last flex justify-end">
            <AdminUserBadge />
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 font-body text-sm mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              Failed to load pages. Please try refreshing.
            </div>
          )}

          {isLoading ? (
             <div className="flex items-center justify-center h-64">
               <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
             </div>
          ) : data?.data?.length === 0 ? (
             <div className="bg-surface-container border border-outline-variant/30 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant">auto_awesome_mosaic</span>
                </div>
                <h3 className="font-headline font-bold text-lg uppercase tracking-wider mb-2 text-black">NO PAGES FOUND</h3>
                <p className="font-body text-on-surface-variant text-sm mb-6">Create your first landing page to capture leads via ad campaigns.</p>
                <Link href="/admin/landing/new" className="border border-outline hover:border-primary text-black hover:text-primary transition-colors font-label font-bold text-xs uppercase tracking-widest px-6 py-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Create Campaign
                </Link>
             </div>
          ) : (
            <div className="bg-surface-container border border-outline-variant/30 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-outline-variant/20 bg-surface/50">
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 w-1/3">Campaign</th>
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4">Variants</th>
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 w-32">Status</th>
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {data?.data?.map((page) => (
                       <tr key={page._id} className="border-b border-outline-variant/10 hover:bg-black/5 transition-colors group">
                          <td className="p-4">
                            <div className="font-headline font-bold text-black uppercase">{page.title}</div>
                            <div className="font-body text-black/50 text-xs mt-1">/landing/{page.slug}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex -space-x-2">
                              {page.variants?.map((v, i) => (
                                <div key={v._id} className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary" title={v.name}>
                                  {String.fromCharCode(65 + (i % 26))}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold font-label uppercase tracking-widest inline-flex items-center gap-1 border
                              ${page.status === 'active' ? 'bg-green-500/10 text-green-700 border-green-500/20' : ''}
                              ${page.status === 'draft' ? 'bg-black/5 text-black/60 border-black/10' : ''}
                              ${page.status === 'paused' ? 'bg-orange-500/10 text-orange-700 border-orange-500/20' : ''}
                              ${page.status === 'archived' ? 'bg-red-500/10 text-red-700 border-red-500/20' : ''}
                            `}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {page.status}
                            </span>
                          </td>
                          <td className="p-4">
                           <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                             <Link href={`/admin/landing/${page._id}/analytics`} className="p-1.5 md:p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 rounded-full" title="Analytics">
                               <span className="material-symbols-outlined text-base md:text-lg">monitoring</span>
                             </Link>
                             <Link href={`/admin/landing/${page._id}/edit`} className="p-1.5 md:p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 rounded-full" title="Edit">
                               <span className="material-symbols-outlined text-base md:text-lg">edit</span>
                             </Link>
                             <a href={`/landing/${page.slug}`} target="_blank" rel="noreferrer" className="p-1.5 md:p-2 text-on-surface-variant hover:text-black transition-colors hover:bg-black/5 rounded-full" title="Preview">
                               <span className="material-symbols-outlined text-base md:text-lg">visibility</span>
                             </a>
                             <button onClick={() => handleDelete(page._id)} className="p-1.5 md:p-2 text-on-surface-variant hover:text-red-600 transition-colors hover:bg-red-500/10 rounded-full" title="Delete">
                               <span className="material-symbols-outlined text-base md:text-lg">delete</span>
                             </button>
                           </div>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
