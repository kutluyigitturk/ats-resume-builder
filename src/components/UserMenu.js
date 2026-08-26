"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { useSessionUser } from "@/components/SessionUser";
import { getResumes } from "@/lib/resumeManager";
import {
  AwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DollarIcon,
  FileTextIcon,
  LogOutIcon,
  SettingsOutlineIcon,
} from "@/icons";

const BORDER = "#e5e7eb";
const HOVER = "#f4f5f7";

export default function UserMenu() {
  const router = useRouter();
  const user = useSessionUser();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resumeCount, setResumeCount] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const triggerRef = useRef(null);
  const rootRef = useRef(null);
  const itemRefs = useRef([]);

  async function handleLogout() {
    setLoggingOut(true);

    // The endpoint deletes the session row and clears the cookie, so the
    // token is dead server-side too - not just forgotten by this browser.
    await fetch("/api/auth/logout", { method: "POST" });

    router.push("/login");
    router.refresh();
  }

  const items = [
    { key: "pricing", label: "Pricing", href: "/pricing", icon: <DollarIcon size={17} /> },
    {
      key: "account",
      label: "Account Settings",
      href: "/account",
      icon: <SettingsOutlineIcon size={17} />,
    },
    {
      key: "logout",
      label: loggingOut ? "Logging out…" : "Log out",
      onClick: handleLogout,
      icon: <LogOutIcon size={17} />,
    },
  ];

  function openMenu() {
    // Read on open rather than on mount: deleting or restoring a resume
    // changes this, and the number is only ever looked at from here.
    setResumeCount(getResumes().length);
    setActiveIndex(0);
    setOpen(true);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  // Focus follows the active row, which is what makes the arrow keys mean
  // something to a screen reader as well as to the eye.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleKeyDown(event) {
    const last = items.length - 1;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i === last ? 0 : i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i === 0 ? last : i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(last);
    } else if (event.key === "Tab") {
      // Tab leaves the menu entirely, so it closes - but focus is already on
      // its way somewhere else and must not be dragged back.
      closeMenu({ restoreFocus: false });
    }
  }

  if (!user) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-menu"
        aria-label="Account menu"
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            openMenu();
          }
        }}
        // cursor-pointer is load-bearing: Tailwind v4's preflight dropped the
        // button cursor rule, so without it the pointer never even changes.
        // The hover signal is on the pill's outline because the avatar is
        // opaque and covers most of a background tint. border-transparent at
        // rest is also load-bearing - v4 defaults border-color to currentColor.
        className="group flex cursor-pointer items-center gap-1 rounded-full border border-transparent py-0.5 pr-1 pl-0.5 transition-colors hover:border-[#d1d5db] hover:bg-white aria-expanded:border-[#d1d5db] aria-expanded:bg-white focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Avatar
          name={user.name}
          email={user.email}
          size={32}
          src={avatarSrc(user.avatarUpdatedAt)}
        />
        <span
          className="text-slate-500 transition-colors group-hover:text-slate-700 group-aria-expanded:text-slate-700"
          aria-hidden="true"
        >
          {open ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
        </span>
      </button>

      {open && (
        <div
          id="user-menu"
          role="menu"
          aria-label="Account"
          onKeyDown={handleKeyDown}
          className="absolute top-full right-0 z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border bg-white py-1"
          style={{
            borderColor: BORDER,
            boxShadow: "0 1px 2px rgba(23,23,27,0.04), 0 16px 40px -16px rgba(23,23,27,0.22)",
          }}
        >
          {/* Identity */}
          <div className="flex items-start gap-3 px-4 pt-3 pb-3">
            <div className="min-w-0 flex-1">
              {/* Accounts made before the name field existed have none, and
                  printing the address on both lines said nothing twice. */}
              <p className="truncate text-[14px] font-semibold text-slate-900">
                {user.name || user.email}
              </p>
              <p className="mt-0.5 truncate text-[12.5px] text-slate-500">
                {user.name ? user.email : "No name set"}
              </p>
            </div>

            {/* Held open for the light/dark switch. Reserving it now means
                adding the control later does not re-cut the name beside it. */}
            <span aria-hidden="true" className="h-7 w-14 shrink-0" />
          </div>

          <div className="h-px" style={{ background: BORDER }} />

          {/* Two numbers worth knowing without opening anything */}
          <div className="flex items-stretch">
            <div className="flex flex-1 items-center gap-2 px-4 py-2.5">
              <span className="text-slate-400" aria-hidden="true">
                <FileTextIcon size={16} />
              </span>
              <span className="text-[13px] font-semibold text-slate-900">
                {resumeCount ?? "—"}
                <span className="sr-only"> resumes</span>
              </span>
            </div>

            <div className="w-px" style={{ background: BORDER }} />

            <div className="flex flex-1 items-center gap-2 px-4 py-2.5">
              <span className="text-slate-400" aria-hidden="true">
                <AwardIcon size={16} />
              </span>
              <span className="text-[13px] font-semibold text-slate-900">
                <span className="sr-only">Plan: </span>
                {planLabel(user.plan)}
              </span>
            </div>
          </div>

          <div className="h-px" style={{ background: BORDER }} />

          {/* Rows. The icon column is a fixed width so every label starts on
              the same vertical line. */}
          <div className="py-1">
            {items.map((item, i) => {
              const shared = {
                role: "menuitem",
                tabIndex: i === activeIndex ? 0 : -1,
                ref: (node) => {
                  itemRefs.current[i] = node;
                },
                onMouseEnter: () => setActiveIndex(i),
                className:
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] text-slate-700 transition-colors hover:bg-[var(--row-hover)] focus:bg-[var(--row-hover)] focus:outline-none",
                style: { "--row-hover": HOVER },
              };

              const inner = (
                <>
                  <span className="flex w-[18px] shrink-0 justify-center text-slate-400">
                    {item.icon}
                  </span>
                  {item.label}
                </>
              );

              return item.href ? (
                <Link
                  key={item.key}
                  href={item.href}
                  {...shared}
                  onClick={() => closeMenu({ restoreFocus: false })}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={item.key}
                  type="button"
                  disabled={loggingOut}
                  onClick={item.onClick}
                  {...shared}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// The timestamp doubles as the cache key: the route answers with
// must-revalidate, and this makes a new photo a new URL either way.
function avatarSrc(avatarUpdatedAt) {
  if (!avatarUpdatedAt) return null;
  return `/api/account/avatar?v=${new Date(avatarUpdatedAt).getTime()}`;
}

function planLabel(plan) {
  if (!plan) return "Free";
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}
