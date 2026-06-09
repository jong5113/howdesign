import { cookies } from "next/headers";

import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminNav } from "@/components/admin-nav";
import { AdminProjectList, type AdminProject } from "@/components/admin-project-list";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/admin-auth";
import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Projects",
};

export default async function AdminProjectsPage() {
  const cookieStore = await cookies();
  const isAuthed = isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  let projects: AdminProject[] = [];
  let errorMessage = "";

  if (isAuthed) {
    if (!supabaseClient || !hasSupabaseConfig) {
      errorMessage = "Supabase 환경변수가 설정되어 있지 않습니다.";
    } else {
      const { data, error } = await supabaseClient
        .from("portfolio_projects")
        .select(
          "id, title, subtitle, slug, category, location, area, year, cover_image_url, published, featured, display_order, created_at",
        )
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        errorMessage = error.message;
      } else {
        projects = (data || []) as AdminProject[];
      }
    }
  }

  return (
    <div className="px-5 pb-16 pt-36 sm:px-10 sm:pt-44 lg:px-12">
      <main className="mx-auto grid max-w-[1760px] gap-10">
        <header className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="grid gap-3">
            <p className="text-[11px] uppercase tracking-[0.09em] text-muted">Admin</p>
            <h1 className="text-[18px] font-normal">{isAuthed ? "프로젝트 관리" : "관리자 로그인"}</h1>
            <p className="max-w-2xl text-[13px] leading-6 text-muted">
              {isAuthed
                ? "등록된 포트폴리오를 수정, 공개 전환, 대표 노출 전환, 삭제할 수 있습니다."
                : "프로젝트 관리 화면을 사용하려면 관리자 비밀번호를 입력해주세요."}
            </p>
          </div>
          {isAuthed ? <AdminNav /> : null}
        </header>

        {isAuthed ? <AdminProjectList initialProjects={projects} initialError={errorMessage} /> : <AdminLoginForm />}
      </main>
    </div>
  );
}
