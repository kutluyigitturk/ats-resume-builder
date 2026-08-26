"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// The signup route's ceiling. Anything lower here and a name accepted at
// signup could never be saved again from this page.
const MAX_LENGTH = 80;

// One line that is either the name or the invitation to add one. The input
// carries the same font, size and centring as the heading it replaces, so
// nothing on the page moves when editing starts.
const SHARED = "w-full max-w-full text-center text-[26px] font-bold tracking-tight";
const DISPLAY_FONT = { fontFamily: "var(--font-sora), sans-serif" };

export default function NameField({ name, onSaved }) {
  const router = useRouter();
  const inputRef = useRef(null);

  // Escape blurs the field, and blur saves - without this the cancel would
  // immediately be undone by the save it triggers on its way out.
  const cancelledRef = useRef(false);

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function start() {
    cancelledRef.current = false;
    setValue(name ?? "");
    setError(null);
    setEditing(true);
  }

  function cancel() {
    cancelledRef.current = true;
    setEditing(false);
    setError(null);
  }

  async function commit() {
    if (cancelledRef.current) return;

    const trimmed = value.trim();

    // Emptying the box is how someone abandons the edit, not how they erase
    // their name - clearing it deliberately would need its own control, and
    // guessing wrong here silently destroys something.
    if (!trimmed || trimmed === (name ?? "")) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ?? "Could not save that name. Try again.");
        inputRef.current?.focus();
        return;
      }

      onSaved(data.name);
      setEditing(false);
      // The navbar's initials come from the layout's session, so they only
      // catch up once that runs again.
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      inputRef.current?.focus();
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="mt-4 flex w-full max-w-[420px] flex-col items-center">
        <input
          ref={inputRef}
          value={value}
          maxLength={MAX_LENGTH}
          disabled={saving}
          aria-label="Your name"
          aria-invalid={error ? "true" : undefined}
          onChange={(event) => setValue(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            } else if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          className={`${SHARED} rounded-xl border border-slate-300 bg-white px-3 py-1 text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 disabled:opacity-60`}
          style={DISPLAY_FONT}
        />
        {error && (
          <p role="alert" className="mt-2 text-[13px] text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    // A real button, not a click handler on the heading: this is an action,
    // and it has to be reachable and announced as one.
    <button
      type="button"
      onClick={start}
      title="Edit your name"
      className="mt-4 max-w-full cursor-pointer rounded-xl border border-transparent px-3 py-1 transition-colors hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <h1
        className={`${SHARED} truncate ${name ? "text-slate-900" : "text-slate-400"}`}
        style={DISPLAY_FONT}
      >
        {name || "Add your name"}
      </h1>
    </button>
  );
}
