"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { AlertTriangleSolidIcon, PencilIcon, PencilSolidIcon, XIcon } from "@/icons";

// The signup route's ceiling. Anything lower here and a name accepted at
// signup could never be saved again from this page.
const MAX_LENGTH = 80;

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

  // Colour has to stay in classes: an inline colour outranks every focus rule,
  // so the ring would never appear.
  const inputRing = error
    ? "border-red-500 focus:border-red-600 focus:ring-red-600"
    : "border-[#e5e5e5] focus:border-neutral-800 focus:ring-neutral-800";

  const button =
    "flex h-10 cursor-pointer items-center rounded-full px-5 text-[13px] font-semibold tracking-wide uppercase transition-colors disabled:cursor-not-allowed";

  return (
    <>
      {/* The name is centred on the avatar above it, not the name-and-pencil
          pair - centring the pair pushes the name off the circle by half the
          button's width. The button hangs off the heading's right edge
          instead, and the padding keeps it on screen for a long name. */}
      <div className="flex h-[46px] w-full items-center justify-center px-11">
        <div className="group/name relative flex max-w-full min-w-0 items-center">
          {/* 24px/600, read off the reference's own inspector. The block
              around it carries 36px, which is what the reference sets on the
              wrapper - but the name itself overrides that, and copying only
              the wrapper is what made ours half again too big. */}
          {/* A bottom border rather than an underline: text-decoration skips
              ink around descenders, so the line broke under the g in Yiğittürk.
              Transparent at rest so the row does not grow on hover. */}
          <h1
            className="min-w-0 truncate border-b-2 border-transparent pb-0.5 text-[24px] leading-[30px] font-semibold transition-colors group-hover/name:border-blue-700"
            style={{ color: name ? "#0a0a0a" : "#737373" }}
          >
            {name || "Add your name"}
          </h1>

          {/* A real button beside the heading rather than a click handler on
              it: this is an action, and it has to be announced as one. */}
          {/* Hidden until the name is hovered, the way the reference does it -
              a control that is always visible beside a heading competes with
              it. Focus brings it back, so the keyboard still reaches it. */}
          <span className="absolute left-full ml-1.5 flex opacity-0 transition-opacity duration-150 group-hover/name:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={start}
              aria-label="Edit name"
              // Only the glyph changes. A filled panel appearing behind a
              // 15px icon is more movement than the action deserves.
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[16px] text-neutral-400 transition-colors hover:text-neutral-600 active:text-neutral-900 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
            >
              <PencilIcon size={15} />
            </button>
          </span>

          {/* Centred under the name, not under the pencil, and carrying the
              caret that points back at what it is labelling. */}
          {/* The delay is on the hover state only, so the tip waits out a
              pointer merely crossing the name but leaves the moment the
              pointer does - and a keyboard focus, which is deliberate, shows
              it at once. */}
          <span
            role="tooltip"
            className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity delay-0 duration-150 group-hover/name:opacity-100 group-hover/name:delay-[1200ms] group-focus-within/name:opacity-100"
          >
            <span
              aria-hidden="true"
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-slate-800"
            />
            Edit Name
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
          {/* 420px so the note breaks where the reference breaks it - measured:
              "…The new name" needs 311px, and the icon, its gap and the 32px
              padding account for the rest. */}
          {/* The identity block sets 36px/600/40px on itself so the name can
              inherit it, and a <dialog> still inherits from its DOM parent even
              while it sits in the top layer - without this reset the label came
              out semibold on a 40px line. */}
          <div className="mx-4 w-full max-w-[420px] rounded-2xl bg-white p-8 text-[15px] leading-normal font-normal shadow-[0_12px_40px_rgba(0,0,0,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <h3
                id="change-name-title"
                className="flex items-center gap-3 text-[20px] leading-7 font-bold text-[#0a0a0a]"
              >
                <span className="shrink-0 text-blue-600">
                  <PencilSolidIcon size={20} />
                </span>
                Change Name
              </h3>

              {/* Colour only. A panel appearing behind a 20px glyph is more
                  movement than closing a dialog deserves, and the reference
                  does not draw one either. */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                aria-label="Close"
                className="mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XIcon size={20} />
              </button>
            </div>

            <label htmlFor="account-name" className="mt-5 block text-[14px] text-[#404040]">
              Full Name
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
              className={`mt-2 h-10 w-full rounded-lg border px-3.5 text-[15px] text-[#0a0a0a] outline-none focus:ring-1 disabled:opacity-60 ${inputRing}`}
            />

            {error ? (
              <p id="account-name-error" role="alert" className="mt-3 text-[13px] text-red-600">
                {error}
              </p>
            ) : (
              <p
                id="account-name-note"
                className="mt-3 flex items-center gap-3 text-[14px] leading-5 text-[#525252]"
              >
                <span className="shrink-0 text-neutral-500">
                  <AlertTriangleSolidIcon size={20} />
                </span>
                No additional action is required. The new name will be updated automatically.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                className={`${button} bg-[#f5f5f5] text-[#171717] hover:bg-[#e5e5e5] disabled:opacity-60`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !canSave}
                className={`${button} bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-45`}
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
