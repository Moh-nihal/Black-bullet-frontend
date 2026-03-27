"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Image from "next/image";

import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const buildQuery = () => {
    let q = "/admin/bookings?limit=50";
    if (statusFilter) q += `&status=${encodeURIComponent(statusFilter)}`;
    return q;
  };

  const { data, error, isLoading, mutate } = useSWR(buildQuery(), fetcher);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Client-side search filtering (backend doesn't support search param for bookings)
  const filteredBookings = (data?.data || []).filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.customerName || "").toLowerCase().includes(q) ||
      (b.customerPhone || "").toLowerCase().includes(q) ||
      (b.customerEmail || "").toLowerCase().includes(q) ||
      (b.vehicleMake || "").toLowerCase().includes(q) ||
      (b.vehicleModel || "").toLowerCase().includes(q) ||
      (b.serviceType || "").toLowerCase().includes(q) ||
      (b._id || "").toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      mutate();
      if (selectedBooking?._id === id) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PENDING": return "text-on-surface-variant";
      case "IN-PROGRESS": return "text-primary";
      case "CRITICAL": return "text-error";
      case "COMPLETED": return "text-tertiary";
      default: return "text-on-surface-variant";
    }
  };

  const getServiceColor = (category) => {
    // simplified category mapping from string/reference if needed
    if (!category) return "bg-surface-variant text-on-surface-variant";
    if (category.toLowerCase().includes("stage")) return "bg-primary/10 text-primary";
    if (category.toLowerCase().includes("exhaust")) return "bg-tertiary/10 text-tertiary";
    return "bg-surface-variant text-on-surface-variant";
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center w-full px-4 pl-14 md:px-8 py-4 md:py-6 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-4 md:gap-8 h-8">
            <h2 className="font-headline text-[15px] md:text-2xl font-black tracking-widest text-white uppercase leading-none mt-1">Booking Management</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6 h-8">
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-8 w-8"><span className="material-symbols-outlined text-lg">notifications</span></button>
            <AdminUserBadge />
          </div>
        </header>

        <section className="p-4 md:p-8 flex-1 flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Table Section */}
          <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 mb-4">
              <div className="shrink-0">
                <h2 className="text-3xl md:text-4xl font-headline font-black tracking-tight text-white uppercase">Master Booking Log</h2>
                <p className="text-on-surface-variant font-body mt-2">Managing {data?.pagination?.total || 0} total performance tuning requests.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto xl:justify-end">
                <div className="relative w-full sm:w-64 shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">search</span>
                  <input 
                    className="bg-surface-container-highest border-none text-xs font-label uppercase tracking-widest px-10 py-2 w-full focus:ring-1 focus:ring-primary placeholder:text-outline text-on-surface" 
                    placeholder="SEARCH BOOKINGS..." 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="bg-surface-container-low p-1 flex gap-1 border border-white/5 overflow-x-auto w-full sm:w-auto">
                  <select 
                    className="bg-transparent border-none text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant focus:ring-0 whitespace-nowrap"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">ALL STATUSES</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="IN-PROGRESS">IN-PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-surface-container border border-white/5 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-high border-b border-white/10">
                    <th className="px-6 py-4 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">ID (Last 4)</th>
                    <th className="px-6 py-4 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">Vehicle</th>
                    <th className="px-6 py-4 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">Service Required</th>
                    <th className="px-6 py-4 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">Preferred Date</th>
                    <th className="px-6 py-4 text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : data?.data?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant font-label uppercase text-sm">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr 
                        key={b._id} 
                        onClick={() => {
                          setSelectedBooking(b);
                          if (window.innerWidth < 1024) {
                            setTimeout(() => document.getElementById('quick-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                          }
                        }}
                        className={`transition-colors cursor-pointer ${selectedBooking?._id === b._id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      >
                        <td className="px-6 py-5 font-headline font-bold text-xs text-primary">#{b._id.slice(-4).toUpperCase()}</td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-white block">{b.customerName || "N/A"}</span>
                          <span className="block text-[10px] text-on-surface-variant uppercase">{b.customerPhone || "NO PHONE"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-on-surface-variant block">{b.vehicleMake} {b.vehicleModel}</span>
                          <span className="block text-[10px] text-on-surface-variant uppercase">Year: {b.vehicleYear || "N/A"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-1 ${getServiceColor(b.serviceType)} text-[10px] font-headline font-bold uppercase tracking-tighter`}>{b.serviceType || "General Query"}</span>
                        </td>
                        <td className="px-6 py-5 text-xs text-on-surface-variant">
                          {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "Not set"}
                        </td>
                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={b.status}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className={`bg-surface-container-highest border-none text-[10px] font-headline font-bold uppercase tracking-widest ${getStatusColor(b.status)} focus:ring-1 focus:ring-primary py-1 px-2`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="IN-PROGRESS">IN-PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="CRITICAL">CRITICAL</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick View Sidebar */}
          <aside id="quick-view" className={`w-full lg:w-80 2xl:w-96 space-y-6 ${selectedBooking ? 'block' : 'hidden'} lg:block`}>
            {selectedBooking ? (
              <div className="bg-surface-container border border-white/5 p-6 space-y-8 sticky top-24">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-headline font-black uppercase tracking-widest text-white">Quick View</h3>
                  <span className="text-[10px] font-headline font-bold text-primary tracking-widest bg-primary/10 px-2 py-1">#{selectedBooking._id.slice(-4).toUpperCase()}</span>
                </div>
                <div className="relative group aspect-video overflow-hidden bg-black">
                  <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">directions_car</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[10px] font-headline font-bold text-primary uppercase">Vehicle Profile</p>
                    <h4 className="text-xl font-headline font-black text-white uppercase italic">{selectedBooking.vehicleMake} {selectedBooking.vehicleModel}</h4>
                  </div>
                </div>
                <div className="space-y-4 shadow-sm bg-background/20 p-4 border border-white/5">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase">Current Status</span>
                    <span className={`text-[10px] font-headline font-bold uppercase ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase">Preferred Date</span>
                    <span className="text-[10px] font-headline font-bold text-white uppercase">{selectedBooking.preferredDate ? new Date(selectedBooking.preferredDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase">Phone</span>
                    <span className="text-[10px] font-headline font-bold text-white uppercase">{selectedBooking.customerPhone || 'N/A'}</span>
                  </div>
                  {selectedBooking.customerEmail && (
                    <div className="flex justify-between border-t border-white/5 pt-2">
                      <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase">Email</span>
                      <span className="text-[10px] font-headline font-bold text-primary uppercase break-words ml-4 truncate" title={selectedBooking.customerEmail}>{selectedBooking.customerEmail}</span>
                    </div>
                  )}
                </div>
                {selectedBooking.notes && (
                  <div className="pt-2">
                    <p className="text-[10px] font-headline font-bold text-on-surface-variant uppercase mb-2 tracking-widest">Internal Notes</p>
                    <p className="text-xs font-body text-white bg-surface-container-highest p-3 italic">"{selectedBooking.notes}"</p>
                  </div>
                )}
                {selectedBooking.message && (
                  <div className="pt-2">
                    <p className="text-[10px] font-headline font-bold text-on-surface-variant uppercase mb-2 tracking-widest">Customer Message</p>
                    <p className="text-xs font-body text-white bg-surface-container-highest p-3">"{selectedBooking.message}"</p>
                  </div>
                )}
                <div className="pt-6 grid grid-cols-2 gap-2">
                  <a href={`tel:${selectedBooking.customerPhone}`} className="text-center bg-surface-container-highest border border-outline-variant text-[10px] font-headline font-bold uppercase py-3 hover:bg-white/5 transition-colors block">Contact Client</a>
                  <button className="bg-primary text-on-primary-fixed text-[10px] font-headline font-bold uppercase py-3 active:scale-95 transition-transform" onClick={() => handleStatusChange(selectedBooking._id, 'IN-PROGRESS')}>Start Service</button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container border border-white/5 p-6 h-64 flex flex-col items-center justify-center text-on-surface-variant sticky top-24 italic">
                <span className="material-symbols-outlined text-4xl mb-4 opacity-50">touch_app</span>
                <p className="text-xs font-label uppercase text-center tracking-widest">Select a booking<br/>to view details</p>
              </div>
            )}
            
            {selectedBooking?.status === "CRITICAL" && (
              <div className="bg-error-container/10 border border-error-container/30 p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <div>
                    <p className="text-[10px] font-headline font-black text-error uppercase">Action Required</p>
                    <p className="text-[10px] font-body text-on-error-container mt-1">This booking requires immediate attention.</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>
    </>
  );
}
