import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin-logout-button";

export function AdminNav() {
  return (
    <nav className="flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.1em]">
      <Link href="/admin/projects" className="px-1 py-2 underline-offset-4 hover:underline">
        Project List
      </Link>
      <Link href="/admin/projects/new" className="px-1 py-2 underline-offset-4 hover:underline">
        New Project
      </Link>
      <AdminLogoutButton />
    </nav>
  );
}
