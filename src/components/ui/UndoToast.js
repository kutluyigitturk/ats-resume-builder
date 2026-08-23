"use client";

import { useEffect, useRef, useState } from "react";
import { TrashOutlineIcon } from "@/icons";

// Five seconds all in: held long enough to read, then a fade that tells the
// user it is going instead of leaving them to wonder whether it ever will.
const HOLD_MS = 2800;
const FADE_MS = 2200;

// The recovery that replaces a confirmation dialog. A dialog taxes every
// correct delete to catch a rare wrong one, and people answer it by reflex;
// this interrupts nobody and still catches the mistake.
//
// Focus moves here on open. After the card unmounts focus would otherwise fall
// to the body, and a toast nobody can reach is no recovery at all for anyone
// working from the keyboard - it also makes the only emphasised thing on
// screen the way back rather than the thing that just happened.
export default function UndoToast({ message, name, actionLabel = "Undo", onAction, onDismiss }) {
  const actionRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    actionRef.current?.focus();
  }, []);

  useEffect(() => {
    if (paused) return;

    const fade = setTimeout(() => setFading(true), HOLD_MS);
    const leave = setTimeout(onDismiss, HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(fade);
      clearTimeout(leave);
    };
  }, [paused, onDismiss]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onDismiss();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  // Coming back from a fade has to undo the fade as well as the clock,
  // otherwise the toast reappears at whatever opacity it had reached.
  const hold = () => {
    setPaused(true);
    setFading(false);
  };

  return (
    // Centred by the layout, not by a transform. Tailwind's -translate-x-1/2
    // sets the `translate` property while a keyframe sets `transform`, and the
    // two stack: the toast opened half its own width to the left and jumped to
    // the middle when the animation ended. A full-width row that centres its
    // child leaves `transform` free for the entrance.
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        // Polite, not an alert: nothing has gone wrong.
        role="status"
        className="undo-toast pointer-events-auto flex max-w-[30rem] items-center gap-3 rounded-2xl border border-slate-200/70 py-2.5 pr-2.5 pl-4"
        style={{
          background: "#fff",
          boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 16px 40px -18px rgba(15,23,42,0.30)",
          opacity: fading ? 0 : 1,
          transition: `opacity ${fading ? FADE_MS : 200}ms ${fading ? "linear" : "ease"}`,
        }}
        onMouseEnter={hold}
        onMouseLeave={() => setPaused(false)}
        // Only a focus the user can see holds the toast open. The line above
        // hands focus to Undo on every delete, so pausing on plain focus meant
        // a mouse user's toast sat there until they clicked something else.
        onFocusCapture={(e) => {
          if (e.target.matches(":focus-visible")) hold();
        }}
        onBlurCapture={() => setPaused(false)}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
          aria-hidden="true"
        >
          <TrashOutlineIcon size={14} />
        </span>

        <p className="min-w-0 truncate text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{name}</span> {message}
        </p>

        <span className="h-5 w-px shrink-0 bg-slate-200" aria-hidden="true" />

        <button
          ref={actionRef}
          type="button"
          onClick={onAction}
          className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
