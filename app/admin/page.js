"use client";

import { useState } from "react";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Link from "next/link";
import Image from "next/image";

import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url) => api.get(url).then((res) => res.data.data);

const getBookingColors = (statusRaw) => {
  const normalized = (statusRaw || "").toUpperCase();
  if (normalized === "PENDING") {
    return { statusColor: "bg-primary/10 text-primary", dotColor: "bg-primary" };
  }
  if (normalized === "CONFIRMED") {
    return { statusColor: "bg-[#10b981]/10 text-[#10b981]", dotColor: "bg-[#10b981]" };
  }
  if (normalized === "COMPLETED") {
    return { statusColor: "bg-tertiary-dim/10 text-tertiary-dim", dotColor: "bg-tertiary-dim" };
  }
  return { statusColor: "bg-white/10 text-white", dotColor: "bg-white" };
};

export default function AdminDashboardPage() {
  const { data, error, isLoading } = useSWR("/admin/dashboard", fetcher);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = (data?.recentBookings || []).filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.client || "").toLowerCase().includes(q) ||
      (b.vehicle || "").toLowerCase().includes(q) ||
      (b.id || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        {/* Topbar */}
        <header className="flex flex-wrap justify-between items-center w-full gap-x-4 gap-y-4 px-4 pl-14 md:px-8 py-4 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="order-1 flex items-center gap-4 md:gap-8 w-auto h-8">
            <h1 className="text-[15px] md:text-xl font-black tracking-widest text-white uppercase font-headline leading-none mt-1">
              Operations Overview
            </h1>
          </div>

          <div className="order-2 flex items-center gap-4 ml-auto h-8">
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-8 w-8">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/10 h-8">
              <AdminUserBadge />
            </div>
          </div>

          <div className="order-3 w-full md:w-auto md:flex-1 md:order-1 md:ml-8 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="bg-surface-container-highest border-none text-xs text-white px-10 py-2 w-full md:w-64 focus:ring-0 focus:border-b-2 focus:border-primary transition-all font-label uppercase tracking-widest placeholder:text-outline"
              placeholder="Search vehicle or client..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="p-8 space-y-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 bg-error-container/20 border border-error text-error text-center font-bold">
              Failed to load dashboard data. Please try again.
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bookings */}
                <div className="bg-surface-container p-6 border-b-2 border-primary-dim shadow-[0_0_40px_rgba(255,143,115,0.1)]">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-headline text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant">Total Bookings</p>
                    <span className="text-primary text-xs font-bold">{data?.metrics?.changePct > 0 ? "+" : ""}{data?.metrics?.changePct}%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-headline font-bold">{data?.metrics?.totalBookings || 0}</h3>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">Units</span>
                  </div>
                  <div className="mt-4 w-full h-1 bg-surface-container-highest">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, data?.metrics?.changePct || 0))}%` }} />
                  </div>
                </div>
                {/* Enquiries */}
                <div className="bg-surface-container p-6 border-b-2 border-tertiary shadow-[0_0_40px_rgba(255,143,115,0.1)]">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-headline text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant">New Enquiries</p>
                    <span className="material-symbols-outlined text-tertiary text-sm">chat_bubble</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-headline font-bold">{data?.metrics?.newEnquiries || 0}</h3>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">{data?.metrics?.newEnquiriesPending || 0} Pending</span>
                  </div>
                  <p className="mt-4 text-[10px] text-tertiary uppercase font-bold tracking-widest">{data?.metrics?.newEnquiriesPending > 0 ? "Action Required" : "All Clear"}</p>
                </div>
                {/* Revenue */}
                <div className="bg-surface-container-highest p-6 relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="material-symbols-outlined text-white/5 text-6xl">trending_up</span>
                  </div>
                  <p className="font-headline text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Revenue Velocity</p>
                  <h3 className="text-2xl font-headline font-bold text-white italic tracking-tighter uppercase">{data?.metrics?.revenueVelocityLabel || "Steady Flow"}</h3>
                  <div className="mt-4 flex gap-1">
                    <div className="h-8 w-full bg-primary/20" />
                    <div className="h-10 w-full bg-primary/40" />
                    <div className="h-12 w-full bg-primary/60" />
                    <div className="h-16 w-full bg-primary" />
                    <div className="h-14 w-full bg-primary/80" />
                  </div>
                </div>
              </section>

              {/* Chart + Live Stats */}
              <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-surface-container p-8">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Booking Velocity</h2>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-on-surface-variant">
                        <span className="w-2 h-2 bg-primary" /> Current
                      </span>
                      <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-on-surface-variant">
                        <span className="w-2 h-2 bg-white/10" /> Previous
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto pb-4 -mb-4">
                    <div className="flex items-end gap-4 h-64 border-l border-b border-white/5 pb-2 pl-4 min-w-[600px]">
                    {data?.bookingVelocity?.series?.map((bar) => (
                      <div key={bar.label} className="flex-1 flex flex-col justify-end gap-1 h-full">
                        <div className="bg-white/5 w-full transition-all duration-1000" style={{ height: `${bar.prev}%` }} />
                        <div className="bg-primary w-full transition-all duration-1000" style={{ height: `${bar.curr}%` }} />
                        <p className="text-[10px] text-center mt-2 font-headline uppercase text-on-surface-variant">{bar.label}</p>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-high p-8 flex flex-col justify-between border-l border-primary/20">
                  <div className="space-y-6">
                    <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-primary">Live Stats</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Service Queue</p>
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-headline font-bold">{data?.liveStats?.serviceQueue || 0}</p>
                          <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${data?.liveStats?.utilizationPct >= 80 ? 'bg-error-container text-on-error-container' : 'bg-primary/20 text-primary'}`}>
                            {data?.liveStats?.serviceQueueStatusLabel || "Clear"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Technicians</p>
                        <p className="text-2xl font-headline font-bold">{data?.liveStats?.techniciansActive || 0} <span className="text-sm font-normal text-on-surface-variant">/ {data?.liveStats?.techniciansTotal || 10}</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                    <div className="w-full aspect-square bg-surface-container-highest flex items-center justify-center p-4 border border-white/5">
                      <div className="relative w-full h-full rounded-full border-4 border-white/5 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-headline font-bold">{data?.liveStats?.utilizationPct || 0}%</p>
                          <p className="text-[8px] uppercase font-bold tracking-widest text-on-surface-variant">Utilization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

          {/* Recent Bookings Table */}
          <section className="bg-surface-container">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Recent Bookings</h2>
              <button className="text-xs uppercase font-bold text-primary hover:underline transition-all">Export Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-white/5">
                    <th className="px-8 py-4 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Client Name</th>
                    <th className="px-8 py-4 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Vehicle</th>
                    <th className="px-8 py-4 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Service</th>
                    <th className="px-8 py-4 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Status</th>
                    <th className="px-8 py-4 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Date</th>
                    <th className="px-8 py-4 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-10 text-center text-on-surface-variant text-sm">
                        No recent bookings found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const colors = getBookingColors(b.statusRaw);
                      return (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5">
                            <p className="text-sm font-bold text-white">{b.client || "Guest"}</p>
                            <p className="text-[10px] text-on-surface-variant">{b.id}</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm">{b.vehicle || "N/A"}</p>
                            <p className="text-[10px] text-on-surface-variant">{b.vehicleColor || "-"}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-surface-container-highest border border-white/10">{b.service || "General"}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${colors.statusColor} text-[10px] font-bold uppercase`}>
                              <span className={`w-1 h-1 ${colors.dotColor} rounded-full`} /> {b.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm text-on-surface-variant">{b.date || "-"}</td>
                          <td className="px-8 py-5">
                            <Link href={`/admin/bookings?id=${b.id}`} className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 border-t border-white/5 flex justify-center">
              <Link href="/admin/bookings" className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors">
                View All Transactions
              </Link>
            </div>
          </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
