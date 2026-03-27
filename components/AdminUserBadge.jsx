"use client";

import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AdminUserBadge() {
  const { data } = useSWR("/admin/me", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const adminName = data?.admin?.displayName || data?.admin?.name || data?.admin?.email || "Admin";
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center">
        <span className="text-primary text-[10px] font-headline font-bold tracking-wider">
          {initials}
        </span>
      </div>
      <span className="hidden xl:block text-xs font-label uppercase tracking-widest text-on-surface-variant">
        {adminName}
      </span>
    </div>
  );
}
