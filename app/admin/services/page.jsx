"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Link from "next/link";

import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const buildQuery = () => {
    let q = "/admin/services?limit=100";
    if (searchQuery) q += `&search=${encodeURIComponent(searchQuery)}`;
    if (statusFilter) q += `&status=${encodeURIComponent(statusFilter)}`;
    if (categoryFilter) q += `&category=${encodeURIComponent(categoryFilter)}`;
    return q;
  };

  const { data, error, isLoading, mutate } = useSWR(buildQuery(), fetcher);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      toast.success("Service deleted successfully");
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete service");
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        {/* Topbar */}
        <header className="flex flex-wrap justify-between items-center w-full gap-x-4 gap-y-4 px-4 pl-14 md:px-8 lg:px-12 py-4 md:py-6 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="order-1 flex items-center gap-4 md:gap-8 w-auto h-8">
            <h2 className="font-headline text-[15px] md:text-2xl font-black tracking-widest text-white uppercase leading-none mt-1">Service Inventory</h2>
          </div>
          
          <div className="order-2 flex items-center gap-4 ml-auto h-8">
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-8 w-8"><span className="material-symbols-outlined text-lg">notifications</span></button>
            <AdminUserBadge />
          </div>
        </header>

        <div className="p-8 lg:p-12 space-y-12">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-label text-[10px] uppercase tracking-[0.3em]">
                <span className="w-8 h-[1px] bg-primary" />
                <span>Garage Assets</span>
              </div>
              <h3 className="font-headline text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">Performance Catalog</h3>
            </div>
            <Link href="/admin/services/new" className="bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-6 lg:px-8 py-4 font-label uppercase text-sm font-black tracking-widest flex items-center gap-3 hover:shadow-[0_0_40px_rgba(255,143,115,0.1)] transition-all shrink-0">
              <span className="material-symbols-outlined">add_box</span>
              + Add New Service
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5">
            {[
              { label: "Total Services", val: data?.pagination?.total?.toString() || "0" },
              { label: "Active Services", val: data?.data?.filter(s => s.status?.toUpperCase() === 'ACTIVE')?.length?.toString() || "0", highlight: true },
              { label: "Draft Elements", val: data?.data?.filter(s => s.status?.toUpperCase() !== 'ACTIVE')?.length?.toString() || "0" },
              { label: "Server Load", val: "Optimal" },
            ].map((s, i) => (
              <div key={s.label} className={`bg-surface-container p-6 lg:p-8 space-y-1 ${i < 3 ? "border-r border-white/5" : ""}`}>
                <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">{s.label}</p>
                <p className={`font-headline text-2xl lg:text-3xl font-bold ${s.highlight ? "text-primary" : "text-white"}`}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-4">
            <h4 className="font-headline text-lg md:text-xl font-bold uppercase tracking-widest border-b-2 border-primary-dim pb-2 inline-block shrink-0">Service Catalog</h4>
            
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto lg:justify-end">
              <div className="relative w-full md:w-64 shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">search</span>
                <input 
                  className="bg-surface-container-highest border-none text-xs font-label uppercase tracking-widest px-10 py-2 w-full focus:ring-1 focus:ring-primary placeholder:text-outline" 
                  placeholder="SEARCH SERVICES..." 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 md:gap-4 flex-wrap overflow-x-auto w-full md:w-auto pb-2 -mb-2 md:pb-0 md:mb-0">
                <select 
                  className="text-[10px] font-label uppercase tracking-widest px-4 py-2 bg-surface-container-high border border-outline-variant/20 focus:ring-1 focus:ring-primary"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                <select 
                  className="text-[10px] font-label uppercase tracking-widest px-4 py-2 bg-surface-container-high border border-outline-variant/20 focus:ring-1 focus:ring-primary"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="performance">Performance Tuning</option>
                  <option value="aesthetics">Aesthetics &amp; Body</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="protection">Protection</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-container/60 backdrop-blur-xl border border-white/5 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-highest/50 border-b border-white/10">
                  <th className="p-4 lg:p-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Image</th>
                  <th className="p-4 lg:p-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Service Name</th>
                  <th className="p-4 lg:p-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Category</th>
                  <th className="p-4 lg:p-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Pricing</th>
                  <th className="p-4 lg:p-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Status</th>
                  <th className="p-4 lg:p-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin mx-auto" /></td>
                  </tr>
                ) : data?.data?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-sm font-label uppercase text-on-surface-variant">No services found.</td>
                  </tr>
                ) : (
                  data?.data?.map((r) => (
                    <tr key={r._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 lg:p-6">
                        <div className="w-16 h-10 bg-surface-container-lowest border border-white/10 overflow-hidden flex items-center justify-center">
                          {r.images?.[0] ? (
                            <img src={r.images[0]} alt={r.title} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant text-sm grayscale group-hover:grayscale-0 transition-all">build</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 lg:p-6">
                        <span className="font-headline text-sm font-bold tracking-wider text-white">{r.title}</span>
                        <p className="text-[10px] text-on-surface-variant mt-1">{r.slug}</p>
                      </td>
                      <td className="p-4 lg:p-6"><span className="text-xs font-label uppercase text-on-surface-variant">{r.category || "General"}</span></td>
                      <td className="p-4 lg:p-6"><span className="font-headline text-sm font-bold text-white">AED {r.price || 0}</span></td>
                      <td className="p-4 lg:p-6">
                        <span className={`px-2 py-1 ${r.status?.toUpperCase() === "ACTIVE" ? "bg-primary/10 text-primary" : "bg-error-container/20 text-error"} text-[9px] font-black font-label uppercase tracking-widest`}>{r.status || "DRAFT"}</span>
                      </td>
                      <td className="p-4 lg:p-6 text-right space-x-2">
                        <Link href={`/admin/services/new?id=${r._id}`} className="p-2 inline-block hover:bg-white/5 text-on-surface-variant hover:text-white transition-all"><span className="material-symbols-outlined text-sm">edit</span></Link>
                        <button onClick={() => handleDelete(r._id)} className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Gauges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-surface-container/60 backdrop-blur-xl p-8 border border-white/5 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-label text-xs uppercase tracking-widest font-black">Storage Health</h4>
                  <span className="text-tertiary font-headline font-bold text-lg">78%</span>
                </div>
                <div className="h-1 bg-surface-container-highest overflow-hidden"><div className="h-full bg-tertiary w-[78%]" /></div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Media server utilization for 4K service showcase renders.</p>
              </div>
            </div>
            <div className="bg-surface-container/60 backdrop-blur-xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-label text-xs uppercase tracking-widest font-black">Popular Category</h4>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                </div>
                <p className="font-headline text-xl font-bold uppercase">ECU Remapping</p>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">+12% increase in bookings compared to last month.</p>
              </div>
            </div>
            <div className="bg-surface-container-highest p-8 border border-white/5 space-y-4">
              <h4 className="font-label text-xs uppercase tracking-widest font-black">System Status</h4>
              <div className="flex items-center gap-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </div>
                <span className="font-headline text-sm font-bold uppercase tracking-widest">Core Engine: Optimal</span>
              </div>
              <p className="text-[10px] text-on-surface-variant">Last database sync was performed 4 minutes ago.</p>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 pt-4 text-center md:text-left">
            <p className="font-label text-[10px] uppercase tracking-widest border-b md:border-b-0 border-white/10 pb-4 md:pb-0">© 2024 Black Bullet Garage Admin System v2.4.1</p>
            <div className="flex items-center gap-4 justify-center">
              <button className="p-2 border border-white/10 hover:border-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <span className="font-label text-[10px] tracking-widest flex items-center h-full pt-0.5">01 / 04</span>
              <button className="p-2 border border-white/10 hover:border-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
