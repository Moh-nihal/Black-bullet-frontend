"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetcher = (url) => api.get(url).then((res) => res.data);

const LEAD_STATUSES = [
  { id: "new", label: "New Lead", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  { id: "contacted", label: "Contacted", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  { id: "qualified", label: "Qualified", color: "bg-purple-500/10 text-purple-700 border-purple-500/20" },
  { id: "closed", label: "Closed/Won", color: "bg-green-500/10 text-green-700 border-green-500/20" },
  { id: "lost", label: "Lost/Dead", color: "bg-red-500/10 text-red-700 border-red-500/20" },
];

export default function AdminLeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const buildQuery = () => {
    let q = "/admin/leads?limit=100";
    if (searchQuery) q += `&search=${encodeURIComponent(searchQuery)}`;
    if (statusFilter) q += `&status=${encodeURIComponent(statusFilter)}`;
    return q;
  };

  const { data, error, isLoading, mutate } = useSWR(buildQuery(), fetcher);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/leads/${id}/status`, { status: newStatus });
      toast.success("Lead status updated");
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        {/* Topbar */}
        <header className="flex flex-wrap justify-between items-center w-full gap-x-4 gap-y-4 px-4 pl-14 md:px-8 lg:px-12 py-4 md:py-6 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="order-1 flex items-center gap-4 md:gap-8 w-auto h-8">
            <h2 className="font-headline text-[15px] md:text-2xl font-black tracking-widest text-black uppercase leading-none mt-1">Lead Pipeline</h2>
          </div>
          
          <div className="order-last sm:order-2 w-full sm:w-auto flex-1 max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                placeholder="SEARCH LEADS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-highest border-none text-xs text-black px-10 py-2 w-full focus:ring-1 focus:ring-primary transition-all font-label uppercase tracking-widest placeholder:text-on-surface-variant/70"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-highest border-none text-xs text-black pl-4 pr-8 py-2 focus:ring-1 focus:ring-primary transition-all font-label uppercase tracking-widest min-w-[140px]"
            >
              <option value="">ALL STATUSES</option>
              {LEAD_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
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
              Failed to load leads pipeline.
            </div>
          )}

          {isLoading ? (
             <div className="flex items-center justify-center h-64">
               <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
             </div>
          ) : data?.data?.length === 0 ? (
             <div className="bg-surface-container border border-outline-variant/30 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant">group_off</span>
                </div>
                <h3 className="font-headline font-bold text-lg uppercase tracking-wider mb-2 text-black">NO LEADS FOUND</h3>
                <p className="font-body text-on-surface-variant text-sm mb-6">Drive traffic to your landing pages to start collecting leads.</p>
             </div>
          ) : (
            <div className="bg-surface-container border border-outline-variant/30 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                     <tr className="border-b border-outline-variant/20 bg-surface/50">
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 w-1/4">Date Received</th>
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 w-1/4">Prospect Info</th>
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 w-1/4">Campaign Info</th>
                       <th className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold p-4 w-1/4">Pipeline Stage</th>
                     </tr>
                   </thead>
                   <tbody>
                     {data?.data?.map((lead) => (
                       <tr key={lead._id} className="border-b border-outline-variant/10 hover:bg-black/5 transition-colors group align-top">
                          <td className="p-4">
                            <span className="font-label text-xs font-bold uppercase tracking-widest text-black">
                               {new Date(lead.createdAt).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="block font-body text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">
                               {new Date(lead.createdAt).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-headline font-bold text-black uppercase">{lead.name}</div>
                            <div className="font-body text-primary text-sm mt-1 mb-2 font-bold select-all tracking-widest">{lead.phone}</div>
                            {lead.vehicleModel && (
                              <div className="inline-flex items-center gap-1 bg-surface-container-highest px-2 py-1 border border-outline-variant/30 mt-1">
                                <span className="material-symbols-outlined text-[10px] text-on-surface-variant">directions_car</span>
                                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-black/80">{lead.vehicleModel}</span>
                              </div>
                            )}
                            {lead.message && (
                              <div className="mt-3 bg-white/40 p-3 italic text-xs font-body text-black/70 border-l-2 border-primary/40 break-words whitespace-pre-wrap">
                                "{lead.message}"
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-headline font-bold text-black uppercase text-sm">{lead.landingPageId?.title || 'Unknown Campaign'}</div>
                            <Link href={`/admin/landing/${lead.landingPageId?._id}/analytics`} className="text-[10px] font-label font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1 mt-1">
                               View Analytics <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                            </Link>
                          </td>
                          <td className="p-4">
                            <select 
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                              className={`w-full text-xs font-label font-bold uppercase tracking-widest p-2 border focus:ring-1 focus:ring-primary transition-colors cursor-pointer outline-none appearance-none rounded-none
                                ${LEAD_STATUSES.find(s => s.id === lead.status)?.color || 'bg-black/5 text-black border-black/10'}
                              `}
                            >
                              {LEAD_STATUSES.map(s => <option key={s.id} value={s.id} className="bg-surface text-black">{s.label}</option>)}
                            </select>
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
