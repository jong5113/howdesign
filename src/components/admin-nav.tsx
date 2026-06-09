import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin-logout-button";

export function AdminNav() {
  return (
    <nav className="flex flex-wrap items-center gap-5 text-[12px] uppercase tracking-[0.09em]">
      <Link href="/admin/projects/new" className="underline-offset-4 hover:underline">
        New Project
      </Link>
      <Link href="/admin/projects" className="underline-offset-4 hover:underline">
        Project List
      </Link>
      <AdminLogoutButton />
    </nav>
  );
}
