"use client";

import AdminSidebar from "@/components/AdminSidebar";
import BlogForm from "@/components/BlogForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url) => api.get(url).then((res) => res.data.data);

function BlogFormWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, error, isLoading } = useSWR(id ? `/admin/blog/${id}` : null, fetcher);

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
        Failed to load blog post data.
      </div>
    );
  }

  return <BlogForm initialData={data || {}} />;
}

export default function AddBlogPage() {
  return (
    <>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-surface min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-4 pl-14 md:px-8 lg:px-12 py-4 md:py-8 bg-background/60 backdrop-blur-xl border-b border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 w-full">
            <Link href="/admin/blog" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-sm md:text-base">arrow_back</span>
              <span className="font-label text-[10px] md:text-xs tracking-widest uppercase font-bold">Content Engine</span>
            </Link>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-headline font-bold tracking-[0.05em] uppercase text-white leading-tight">New Intelligence Report</h1>
          </div>
        </header>
        <div className="p-8 lg:p-12">
          <Suspense fallback={<div className="text-center p-8 text-white uppercase font-label">Loading editor...</div>}>
            <BlogFormWrapper />
          </Suspense>
        </div>
      </main>
    </>
  );
}
