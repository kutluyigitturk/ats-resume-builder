"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { AlertTriangleIcon, PencilIcon, XIcon } from "@/icons";

// The signup route's ceiling. Anything lower here and a name accepted at
// signup could never be saved again from this page.
const MAX_LENGTH = 80;

const BORDER = "#e5e7eb";

export default function NameField({ name, onSaved }) {
  const router = useRouter();
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) inputRef.current?.select();
  }, [open]);

  const trimmed = value.trim();
  // Nothing to save until it is both non-empty and different. A Save that
  // writes the same string is a request the user cannot tell apart from one
  // that did something.
  const canSave = trimmed.length > 0 && trimmed !== (name ?? "");

  function start() {
    setValue(name ?? "");
    setError(null);
    setOpen(true);
  }

  async function save() {
    if (!canSave) return;

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
      setOpen(false);
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

  return (
    <>
      {/* The name is centred on the avatar above it, not the name-and-pencil
          pair - centring the pair pushes the name off the circle by half the
          button's width. The button hangs off the heading's right edge
          instead, and the padding keeps it on screen for a long name. */}
      <div className="mt-4 flex w-full justify-center px-11">
        <div className="relative flex max-w-full min-w-0 items-center">
          <h1
            className={`min-w-0 truncate text-[26px] font-bold tracking-tight ${
              name ? "text-slate-900" : "text-slate-400"
            }`}
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            {name || "Add your name"}
          </h1>

          {/* A real button beside the heading rather than a click handler on
              it: this is an action, and it has to be announced as one. */}
          <span className="group absolute left-full ml-1.5 flex">
            <button
              type="button"
              onClick={start}
              aria-label="Edit name"
              // Only the glyph changes. A filled panel appearing behind a
              // 15px icon is more movement than the action deserves.
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-600 active:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
            >
              <PencilIcon size={15} />
            </button>

            <span
              role="tooltip"
              className="pointer-events-none absolute top-full left-1/2 z-10 mt-1.5 -translate-x-1/2 rounded-lg bg-slate-800 px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              Edit name
            </span>
          </span>
        </div>
      </div>

      {open && (
        <Modal
          open
          onClose={saving ? () => {} : () => setOpen(false)}
          labelledBy="change-name-title"
          initialFocusRef={inputRef}
          backdropClass="backdrop:bg-black/20 backdrop:backdrop-blur-sm"
        >
          <div
            className="mx-4 w-full max-w-[420px] rounded-2xl border p-6 shadow-2xl"
            style={{ background: "#fff", borderColor: BORDER }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                id="change-name-title"
                className="flex items-center gap-2.5 text-base font-bold text-slate-900"
              >
                <span className="text-blue-600">
                  <PencilIcon size={16} />
                </span>
                Change name
              </h3>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                aria-label="Close"
                className="-mt-1 -mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XIcon size={17} />
              </button>
            </div>

            <label
              htmlFor="account-name"
              className="mt-5 block text-[13px] font-medium text-slate-600"
            >
              Full name
            </label>
            <input
              id="account-name"
              ref={inputRef}
              value={value}
              maxLength={MAX_LENGTH}
              disabled={saving}
              autoComplete="name"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "account-name-error" : "account-name-note"}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  save();
                }
              }}
              className="mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[15px] text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 disabled:opacity-60"
              style={{ borderColor: BORDER }}
            />

            {error ? (
              <p id="account-name-error" role="alert" className="mt-2 text-[13px] text-red-600">
                {error}
              </p>
            ) : (
              <p id="account-name-note" className="mt-2.5 flex gap-2 text-[12.5px] text-slate-500">
                <span className="mt-px shrink-0 text-slate-400">
                  <AlertTriangleIcon size={14} />
                </span>
                Nothing else to do — this updates everywhere your name appears, including new
                resumes.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ borderColor: BORDER }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !canSave}
                className="cursor-pointer rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
