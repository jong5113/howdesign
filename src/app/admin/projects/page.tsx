import { cookies } from "next/headers";

import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminProjectList, type AdminProject } from "@/components/admin-project-list";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/admin-auth";
import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";

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
        .select("id, title, slug, category, year, published, featured, created_at")
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
        <header className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="grid gap-3">
            <p className="text-[11px] uppercase tracking-[0.09em] text-muted">Admin</p>
            <h1 className="text-[18px] font-normal">{isAuthed ? "프로젝트 관리" : "관리자 로그인"}</h1>
          </div>
          {isAuthed ? <AdminLogoutButton /> : null}
          <p className="max-w-2xl text-[13px] leading-6 text-muted sm:col-span-2">
            {isAuthed
              ? "등록된 포트폴리오의 공개 여부, 메인 노출 여부, 수정과 삭제를 관리합니다."
              : "프로젝트 관리 화면을 사용하려면 관리자 비밀번호를 입력해주세요."}
          </p>
        </header>

        {isAuthed ? <AdminProjectList initialProjects={projects} initialError={errorMessage} /> : <AdminLoginForm />}
      </main>
    </div>
  );
}
