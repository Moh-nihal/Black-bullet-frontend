"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminUserBadge from "@/components/AdminUserBadge";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AdminLandingAnalytics() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(id ? `/admin/landing/${id}/analytics` : null, fetcher);

  const stats = data?.data;

  // Simple pure-CSS pie chart generator
  const renderPieChart = (whatsapp, call, form) => {
    const total = whatsapp + call + form;
    if (total === 0) return <div className="w-48 h-48 rounded-full border-8 border-outline-variant/30 flex items-center justify-center font-label text-xs uppercase text-on-surface-variant font-bold tracking-widest">No Data</div>;

    const pW = (whatsapp / total) * 100;
    const pC = (call / total) * 100;
    const pF = (form / total) * 100;

    return (
      <div 
        className="w-48 h-48 rounded-full"
        style={{
          background: `conic-gradient(
            #25D366 0% ${pW}%,
            #DC0000 ${pW}% ${pW + pC}%,
            #1E1E1E ${pW + pC}% 100%
          )`
        }}
        title={`WhatsApp: ${whatsapp}, Call: ${call}, Form: ${form}`}
      />
    );
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        <header className="flex flex-wrap justify-between items-center w-full gap-x-4 gap-y-4 px-4 pl-14 md:px-8 lg:px-12 py-4 md:py-6 sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="order-1 flex items-center gap-4 md:gap-8 w-auto h-8">
            <Link href="/admin/landing" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </Link>
            <div>
              <h2 className="font-headline text-[15px] md:text-2xl font-black tracking-widest text-black uppercase leading-none mt-1">
                Campaign Analytics
              </h2>
              {stats && <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">
                {stats.title}
              </p>}
            </div>
          </div>
          <div className="order-2 sm:order-last flex justify-end">
            <AdminUserBadge />
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto space-y-8">
          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 font-body text-sm flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              Failed to load analytics data.
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-32">
               <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
            </div>
          ) : stats ? (
            <>
              {/* Top Level KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                <div className="bg-surface-container border border-outline-variant/30 p-6 flex flex-col justify-center">
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Views</p>
                  <p className="font-headline font-black text-4xl text-black">{stats.overall.totalViews}</p>
                </div>
                <div className="bg-surface-container border border-outline-variant/30 p-6 flex flex-col justify-center">
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Conversions</p>
                  <p className="font-headline font-black text-4xl text-primary">{stats.overall.totalActions}</p>
                </div>
                <div className="bg-surface-container border border-outline-variant/30 p-6 flex flex-col justify-center">
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Avg Conversion Rate</p>
                  <p className="font-headline font-black text-4xl text-black">{stats.overall.conversionRate}%</p>
                </div>
                <div className="bg-surface-container border border-outline-variant/30 p-6 flex flex-col justify-center">
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 text-xs font-bold font-label uppercase tracking-widest inline-flex items-center gap-2 border
                      ${stats.status === 'active' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 
                      'bg-black/5 text-black/60 border-black/10'}
                    `}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {stats.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Conversion Type Pie Chart */}
                <div className="bg-surface-container border border-outline-variant/30 p-6 lg:p-8 flex flex-col items-center">
                  <h3 className="font-headline font-bold text-lg uppercase w-full mb-8 text-black border-b border-outline-variant/20 pb-4">Conversion Breakdown</h3>
                  {renderPieChart(
                    stats.overall.conversions?.whatsapp || 0,
                    stats.overall.conversions?.call || 0,
                    stats.overall.conversions?.form || 0,
                  )}
                  <div className="w-full mt-8 space-y-3">
                    <div className="flex justify-between items-center bg-surface-container-highest px-4 py-3 border border-outline-variant/30">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-[#25D366]"></span>
                        <span className="font-label text-xs font-bold uppercase tracking-widest">WhatsApp</span>
                      </div>
                      <span className="font-headline font-black">{stats.overall.conversions?.whatsapp || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-highest px-4 py-3 border border-outline-variant/30">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="font-label text-xs font-bold uppercase tracking-widest">Phone Call</span>
                      </div>
                      <span className="font-headline font-black">{stats.overall.conversions?.call || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-highest px-4 py-3 border border-outline-variant/30">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-[#1E1E1E]"></span>
                        <span className="font-label text-xs font-bold uppercase tracking-widest">Lead Form</span>
                      </div>
                      <span className="font-headline font-black">{stats.overall.conversions?.form || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Device Breakdown Box */}
                <div className="bg-surface-container border border-outline-variant/30 p-6 lg:p-8 flex flex-col h-full">
                  <h3 className="font-headline font-bold text-lg uppercase w-full mb-6 text-black border-b border-outline-variant/20 pb-4">Device Traffic</h3>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <div className="flex justify-between font-label text-xs font-bold tracking-widest uppercase mb-2">
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[1em]">smartphone</span> Mobile</span>
                        <span>{stats.overall.devices?.mobile || 0} hits</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${stats.overall.totalViews ? ((stats.overall.devices?.mobile || 0) / stats.overall.totalViews) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-label text-xs font-bold tracking-widest uppercase mb-2">
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[1em]">desktop_windows</span> Desktop</span>
                        <span>{stats.overall.devices?.desktop || 0} hits</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                        <div className="bg-black/60 h-full" style={{ width: `${stats.overall.totalViews ? ((stats.overall.devices?.desktop || 0) / stats.overall.totalViews) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-label text-xs font-bold tracking-widest uppercase mb-2">
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[1em]">tablet_mac</span> Tablet</span>
                        <span>{stats.overall.devices?.tablet || 0} hits</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                        <div className="bg-black/40 h-full" style={{ width: `${stats.overall.totalViews ? ((stats.overall.devices?.tablet || 0) / stats.overall.totalViews) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Variant Winners Box */}
                 <div className="bg-surface-container border border-outline-variant/30 p-6 lg:p-8 flex flex-col h-full overflow-y-auto">
                    <h3 className="font-headline font-bold text-lg uppercase w-full mb-6 text-black border-b border-outline-variant/20 pb-4">A/B Testing Variants</h3>
                    
                    <div className="space-y-4">
                      {stats.variants.map((v, i) => {
                        return (
                          <div key={v._id} className="p-4 border border-outline-variant/30 bg-surface-container-highest">
                            <div className="flex justify-between items-center mb-3">
                               <div className="font-headline font-bold uppercase text-black flex items-center gap-2">
                                 <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary">{String.fromCharCode(65 + i)}</span>
                                 {v.name}
                               </div>
                               <div className="text-xs font-label uppercase font-bold text-on-surface-variant flex gap-1 items-center">
                                 <span className="material-symbols-outlined text-sm">traffic</span>
                                 W: {v.weight}%
                               </div>
                            </div>
                            <div className="flex justify-between">
                              <div className="text-center">
                                <span className="block font-headline font-black text-xl">{v.views}</span>
                                <span className="block font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Views</span>
                              </div>
                              <div className="text-center">
                                <span className="block font-headline font-black text-xl text-primary">{v.totalActions}</span>
                                <span className="block font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Conv</span>
                              </div>
                              <div className="text-center">
                                <span className="block font-headline font-black text-xl">{v.conversionRate}%</span>
                                <span className="block font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Rate</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                 </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
