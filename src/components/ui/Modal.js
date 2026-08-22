"use client";

import { useEffect, useRef } from "react";

// Built on the platform's own <dialog>. showModal() brings the focus trap,
// Escape, the inert background, focus restored to whatever opened it, and the
// top-layer stacking - all of it specified and tested by the browser. A
// hand-written trap is a pile of edge cases that only look right until someone
// tabs backwards out of an iframe.
//
// The dialog element itself is stripped of its own chrome so the card inside
// keeps rendering exactly as it did before.
export default function Modal({ open, onClose, labelledBy, children, backdropClass }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Fires for Escape as well as for close(), so React state and the
    // element's own state cannot drift apart.
    const handleClose = () => onClose();

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // A click that lands on the dialog element itself came from the backdrop:
  // everything visible is inside the card, which stops its own clicks.
  function handleBackdrop(event) {
    if (event.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClick={handleBackdrop}
      // The dialog is the centring box itself, exactly as the old
      // `fixed inset-0 flex` wrapper was. Wrapping the children in another div
      // would make w-full resolve against a shrink-wrapped parent and quietly
      // narrow every card.
      //
      // `hidden open:flex` rather than a bare `flex`: an author display rule
      // beats the browser's `dialog:not([open]) { display: none }`, so a plain
      // flex class would leave the dialog on screen while closed.
      //
      // The backdrop styling comes from the caller: two utilities for the same
      // property on one element resolve by stylesheet order, not by the order
      // they are written, so a default here would fight an override silently.
      className={`m-0 hidden h-full max-h-none w-full max-w-none items-center justify-center overflow-visible border-0 bg-transparent p-0 text-inherit open:flex ${backdropClass}`}
    >
      {children}
    </dialog>
  );
}
