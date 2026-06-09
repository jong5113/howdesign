import { cookies } from "next/headers";
import Link from "next/link";

import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminProjectForm } from "@/components/admin-project-form";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "New Project",
};

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const isAuthed = isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  return (
    <div className="px-5 pb-16 pt-36 sm:px-10 sm:pt-44 lg:px-12">
      <main className="mx-auto grid max-w-[1760px] gap-10">
        <header className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="grid gap-3">
            <p className="text-[11px] uppercase tracking-[0.09em] text-muted">Admin</p>
            <h1 className="text-[18px] font-normal">
              {isAuthed ? "새 포트폴리오 등록" : "관리자 로그인"}
            </h1>
          </div>
          {isAuthed ? <AdminLogoutButton /> : null}
          {isAuthed ? (
            <div className="grid gap-2 text-[13px] leading-6 text-muted sm:col-span-2">
              <p className="max-w-2xl">
                프로젝트 정보를 입력하고 이미지를 여러 장 업로드하면 Supabase Storage와 포트폴리오
                테이블에 자동으로 저장됩니다. 추후 인증을 붙일 수 있도록 별도 관리자 페이지로
                분리했습니다.
              </p>
              <Link href="/admin/projects" className="w-fit text-[12px] uppercase tracking-[0.09em] underline">
                Back to Projects
              </Link>
            </div>
          ) : (
            <p className="max-w-2xl text-[13px] leading-6 text-muted sm:col-span-2">
              프로젝트 등록 화면을 사용하려면 관리자 비밀번호를 입력해주세요.
            </p>
          )}
        </header>

        {isAuthed ? <AdminProjectForm /> : <AdminLoginForm />}
      </main>
    </div>
  );
}
