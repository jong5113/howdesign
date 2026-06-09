import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "로그아웃되었습니다.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });

  return response;
}
