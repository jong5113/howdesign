import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
};

function getText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;
  const honeypot = getText(payload.website);

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = getText(payload.name);
  const email = getText(payload.email);
  const phone = getText(payload.phone);
  const message = getText(payload.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "jong51133@nate.com";
  const from = process.env.CONTACT_FROM_EMAIL || "HOW DESIGN <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.error("[Contact API] RESEND_API_KEY is missing.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const receivedAt = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111;">
      <h2>[HOW DESIGN] 홈페이지 문의가 도착했습니다</h2>
      <p><strong>이름</strong><br />${escapeHtml(name)}</p>
      <p><strong>이메일</strong><br />${escapeHtml(email)}</p>
      <p><strong>연락처</strong><br />${escapeHtml(phone || "-")}</p>
      <p><strong>문의 내용</strong><br />${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      <p><strong>접수 시간</strong><br />${escapeHtml(receivedAt)}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: "[HOW DESIGN] 홈페이지 문의가 도착했습니다",
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Contact API] Email send failed.", errorText);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
