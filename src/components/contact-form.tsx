"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setSubmitState("success");
      setMessage("문의가 정상적으로 접수되었습니다.");
      form.reset();
    } catch (error) {
      console.error("[Contact form] Submit failed.", error);
      setSubmitState("error");
      setMessage("전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="grid gap-2 text-[11px] uppercase tracking-[0.1em]">
        Name
        <input
          name="name"
          required
          placeholder="이름을 입력해주세요"
          className="border border-line bg-white px-4 py-3 text-[14px] normal-case tracking-normal text-foreground outline-none focus:border-foreground"
        />
      </label>

      <label className="grid gap-2 text-[11px] uppercase tracking-[0.1em]">
        Email
        <input
          name="email"
          type="email"
          required
          placeholder="이메일을 입력해주세요"
          className="border border-line bg-white px-4 py-3 text-[14px] normal-case tracking-normal text-foreground outline-none focus:border-foreground"
        />
      </label>

      <label className="grid gap-2 text-[11px] uppercase tracking-[0.1em]">
        Phone
        <input
          name="phone"
          placeholder="연락처를 입력해주세요"
          className="border border-line bg-white px-4 py-3 text-[14px] normal-case tracking-normal text-foreground outline-none focus:border-foreground"
        />
      </label>

      <label className="grid gap-2 text-[11px] uppercase tracking-[0.1em]">
        Message
        <textarea
          name="message"
          required
          placeholder="문의 내용을 입력해주세요"
          className="min-h-36 border border-line bg-white px-4 py-3 text-[14px] normal-case tracking-normal text-foreground outline-none focus:border-foreground"
        />
      </label>

      <button
        type="submit"
        disabled={submitState === "sending"}
        className="bg-foreground px-5 py-4 text-[12px] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-80 disabled:opacity-40"
      >
        {submitState === "sending" ? "Sending..." : "Send"}
      </button>

      {message ? (
        <p className={`text-[13px] ${submitState === "error" ? "text-foreground" : "text-muted"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
