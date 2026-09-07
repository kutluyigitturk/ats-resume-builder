"use client";

import { useEffect } from "react";

// Bottom-right, unlike the undo toast at the bottom centre. That one is a way
// back and has to be found; this one only reports, so it stays out of the way.
export default function StatusToast({ message, busy = false, onDismiss, duration = 2600 }) {
  useEffect(() => {
    if (busy || !onDismiss) return;

    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [busy, onDismiss, duration]);

  return (
    <div
      role="status"
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white py-2.5 pr-4 pl-3.5 text-sm text-slate-700"
      style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 16px 40px -18px rgba(15,23,42,0.30)" }}
    >
      {busy && (
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
        />
      )}
      {message}
    </div>
  );
}
