"use client";

import AdminSidebar from "@/components/AdminSidebar";
import ServiceForm from "@/components/ServiceForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url) => api.get(url).then((res) => res.data.data);

function ServiceFormWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, error, isLoading } = useSWR(id ? `/admin/services/${id}` : null, fetcher);

  if (id && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (id && error) {
    return (
      <div className="p-6 bg-error-container/20 border border-error text-error text-center font-bold">
        Failed to load service data.
      </div>
    );
  }

  return <ServiceForm initialData={data || {}} />;
}

export default function AddServicePage() {
  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-4 pl-14 md:px-8 lg:px-12 py-6 md:py-8 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-6">
            <Link href="/admin/services" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="font-label text-xs tracking-widest uppercase font-bold">Back to List</span>
            </Link>
            <h1 className="text-2xl lg:text-4xl font-headline font-bold tracking-[0.05em] uppercase text-white">Create / Edit Service</h1>
          </div>
        </header>
        <div className="flex-1 px-8 lg:px-12 py-8 lg:py-12 max-w-7xl">
          <Suspense fallback={<div className="text-center p-8 text-white uppercase font-label">Loading editor...</div>}>
            <ServiceFormWrapper />
          </Suspense>
        </div>
      </main>

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-tertiary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </>
  );
}
