import { cookies } from "next/headers";
import Link from "next/link";

import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminNav } from "@/components/admin-nav";
import { AdminProjectForm } from "@/components/admin-project-form";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "New Project",
};

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const isAuthed = isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  return (
    <div className="px-5 pb-20 pt-9 sm:px-10 sm:pt-12 lg:px-12">
      <main className="mx-auto grid max-w-[1760px] gap-10">
        <header className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="grid gap-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Admin</p>
            <h1 className="text-[22px] font-normal tracking-[0.02em]">{isAuthed ? "New Project" : "Admin Login"}</h1>
            <p className="max-w-2xl text-[13px] leading-6 text-muted">
              {isAuthed
                ? "Add project information and upload images. The selected cover image will be used on public lists."
                : "Enter the administrator password to add a project."}
            </p>
          </div>
          {isAuthed ? <AdminNav /> : null}
        </header>

        {isAuthed ? (
          <div className="grid gap-8">
            <Link href="/admin/projects" className="w-fit text-[12px] uppercase tracking-[0.09em] underline">
              Back to Admin
            </Link>
            <AdminProjectForm />
          </div>
        ) : (
          <AdminLoginForm />
        )}
      </main>
    </div>
  );
}
