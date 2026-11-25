import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/admin-auth";
import { PORTFOLIO_CACHE_TAG } from "@/lib/portfolio";
import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";

type ReorderRequest = {
  projectIds?: unknown;
};

type CurrentProjectOrder = {
  id: string;
  display_order: number | null;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (!isAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, message: "관리자 로그인이 필요합니다." }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const requestOrigin = request.headers.get("origin");

  if (requestOrigin && requestOrigin !== requestUrl.origin) {
    return NextResponse.json({ ok: false, message: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  if (!hasSupabaseConfig || !supabaseClient) {
    return NextResponse.json(
      { ok: false, message: "Supabase 환경변수가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const client = supabaseClient;

  const body = (await request.json().catch(() => null)) as ReorderRequest | null;
  const projectIds = Array.isArray(body?.projectIds)
    ? body.projectIds.filter((id): id is string => typeof id === "string" && Boolean(id.trim()))
    : [];

  if (
    projectIds.length === 0 ||
    projectIds.length > 500 ||
    new Set(projectIds).size !== projectIds.length
  ) {
    return NextResponse.json({ ok: false, message: "프로젝트 순서 데이터가 올바르지 않습니다." }, { status: 400 });
  }

  const { data: currentProjects, error: loadError } = await client
    .from("portfolio_projects")
    .select("id, display_order");

  if (loadError) {
    console.error("[Admin reorder] Failed to load current project order.", loadError);
    return NextResponse.json({ ok: false, message: loadError.message }, { status: 500 });
  }

  const currentOrders = (currentProjects || []) as CurrentProjectOrder[];
  const currentIds = new Set(currentOrders.map((project) => project.id));

  if (projectIds.length !== currentOrders.length || projectIds.some((id) => !currentIds.has(id))) {
    return NextResponse.json(
      { ok: false, message: "프로젝트 목록이 변경되었습니다. 새로고침 후 다시 시도해주세요." },
      { status: 409 },
    );
  }

  const updateResults = await Promise.all(
    projectIds.map((id, index) =>
      client
        .from("portfolio_projects")
        .update({ display_order: index + 1 })
        .eq("id", id)
        .select("id")
        .maybeSingle<{ id: string }>(),
    ),
  );
  const failedUpdate = updateResults.find((result) => result.error || !result.data);

  if (failedUpdate) {
    console.error("[Admin reorder] Failed to save project order.", failedUpdate.error);
    await Promise.all(
      currentOrders.map((project) =>
        client
          .from("portfolio_projects")
          .update({ display_order: project.display_order })
          .eq("id", project.id),
      ),
    );

    return NextResponse.json(
      {
        ok: false,
        message: failedUpdate.error?.message ?? "Project order update did not affect a row.",
      },
      { status: 500 },
    );
  }

  revalidateTag(PORTFOLIO_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/commercial");
  revalidatePath("/portfolio/residential");

  return NextResponse.json({ ok: true });
}
