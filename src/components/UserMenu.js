"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const [label, setLabel] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((user) => {
        // Accounts created before the name field existed still only have an
        // address, so the email stays as the fallback.
        if (!cancelled && user) setLabel(user.name || user.email);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    // The endpoint deletes the session row and clears the cookie, so the
    // token is dead server-side too - not just forgotten by this browser.
    await fetch("/api/auth/logout", { method: "POST" });

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="hidden max-w-[200px] truncate text-[13px] text-slate-500 sm:block">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loggingOut ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}
