"use client";

import { useEffect, useRef, useState } from "react";

const VISIBLE_MS = 8000;

// The recovery that replaces a confirmation dialog. A dialog taxes every
// correct delete to catch a rare wrong one, and people answer it by reflex;
// this interrupts nobody and still catches the mistake.
//
// Focus moves here on open. After the card unmounts focus would otherwise fall
// to the body, and a toast nobody can reach is no recovery at all for anyone
// working from the keyboard - it also makes the only emphasised thing on
// screen the way back rather than the thing that just happened.
export default function UndoToast({ message, actionLabel = "Undo", onAction, onDismiss }) {
  const actionRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    actionRef.current?.focus();
  }, []);

  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [paused, onDismiss]);

  return (
    <div
      // Polite, not an alert: nothing has gone wrong.
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="fixed bottom-6 left-1/2 z-50 flex max-w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white"
      style={{
        boxShadow: "0 1px 2px rgba(23,23,27,0.06), 0 16px 40px -16px rgba(23,23,27,0.45)",
        animation: "undoToastIn 160ms ease-out",
      }}
    >
      <style>{`
        @keyframes undoToastIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes undoToastIn {
            from { opacity: 0; transform: translate(-50%, 0); }
            to   { opacity: 1; transform: translate(-50%, 0); }
          }
        }
      `}</style>

      <span className="min-w-0 truncate">{message}</span>

      <span className="h-4 w-px shrink-0 bg-white/20" aria-hidden="true" />

      {/* White rather than blue: blue-700 on slate-900 is unreadable. */}
      <button
        ref={actionRef}
        type="button"
        onClick={onAction}
        className="shrink-0 font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
      >
        {actionLabel}
      </button>
    </div>
  );
}
