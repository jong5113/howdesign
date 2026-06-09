import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, getAdminSessionValue } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const adminSessionValue = getAdminSessionValue();

  if (!adminSessionValue) {
    console.error("[Admin auth] ADMIN_PASSWORD environment variable is missing.");
    return NextResponse.json(
      {
        ok: false,
        message: "ADMIN_PASSWORD 환경변수가 설정되어 있지 않습니다.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        ok: false,
        message: "비밀번호가 올바르지 않습니다.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    message: "로그인되었습니다.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: adminSessionValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
