"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setMessage(data.message || "비밀번호가 올바르지 않습니다.");
        return;
      }

      setMessage(data.message || "로그인되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("[Admin auth] Login request failed.", error);
      setMessage("로그인 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-sm gap-5">
      <div className="grid gap-2">
        <label htmlFor="admin-password" className="text-[12px] uppercase tracking-[0.09em]">
          Admin Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border-b border-line bg-transparent py-2 text-[15px] outline-none"
          autoComplete="current-password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit border border-foreground px-5 py-3 text-[12px] uppercase tracking-[0.09em] disabled:border-line disabled:text-muted"
      >
        {isSubmitting ? "Checking..." : "Enter"}
      </button>
      {message ? <p className="text-[13px] leading-6 text-muted">{message}</p> : null}
    </form>
  );
}
