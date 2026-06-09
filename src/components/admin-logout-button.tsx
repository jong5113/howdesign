"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      window.location.reload();
    } catch (error) {
      console.error("[Admin auth] Logout request failed.", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="w-fit text-[11px] uppercase tracking-[0.09em] text-muted underline-offset-4 hover:underline disabled:text-line"
    >
      {isSubmitting ? "Logging out..." : "Logout"}
    </button>
  );
}
