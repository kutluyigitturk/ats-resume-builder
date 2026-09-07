"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import UserMenu from "@/components/UserMenu";
import { FileSolidIcon, HomeSolidIcon, LogOutIcon, MailSolidIcon, UserXIcon } from "@/icons";

// Measured off the reference's own computed styles: the neutral scale on a
// white ground, no tint anywhere.
export const BORDER = "#e5e5e5"; // neutral-200
export const MUTED = "#f5f5f5"; // neutral-100
export const MUTED_FG = "#737373"; // neutral-500
export const INK = "#0a0a0a"; // neutral-950

const NAV = [
  { href: "/account", label: "My Account", icon: HomeSolidIcon },
  { href: "/account/resumes", label: "My Resumes", icon: FileSolidIcon },
  { href: "/account/cover-letters", label: "My Cover Letters", icon: MailSolidIcon },
];

/* ─── Soon badge ─────────────────────────────────── */

// Changing an address, changing a password, closing an account and managing a
// subscription each need their own server-side design, so none of them is
// wired up. Saying "Soon" in words is the honest version of a control that
// looks ready and does nothing - and it is text, not just a colour.
export function Soon() {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: MUTED, color: MUTED_FG }}
    >
      Soon
    </span>
  );
}

/* ─── Sidebar ────────────────────────────────────── */

function SidebarLink({ href, icon: Icon, label, active }) {
  return (
    // Colour has to come from classes, not an inline style: an inline colour
    // outranks every hover rule, so the row would never change.
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`my-1 flex h-11 items-center rounded-xl px-4 text-[16px] transition-colors hover:text-blue-700 ${
        active
          ? "bg-[#f5f5f5] font-semibold text-blue-700"
          : "font-normal text-[#737373] hover:bg-transparent"
      }`}
    >
      <span className="mr-3 flex h-6 w-6 items-center justify-center">
        <Icon size={24} />
      </span>
      {label}
    </Link>
  );
}

/* ─── Shell ──────────────────────────────────────── */

// The sidebar belongs to the layout, not to any one tab: switching tabs swaps
// the right-hand column and nothing else, which is what the reference does
// when you move between its own settings pages.
export default function AccountShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // The reference fades these rather than tinting them.
  const foot =
    "flex h-10 cursor-pointer items-center px-6 text-[16px] whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: INK }}>
      <Navbar maxWidth="1280px" baseRingClass="ring-slate-200/50" justify="justify-between">
        <Logo />
        <UserMenu />
      </Navbar>

      {/* max-w-screen-2xl, centred - the reference's own `main`. */}
      <div className="mx-auto flex w-full max-w-[1536px] flex-col pt-20 lg:min-h-screen lg:flex-row">
        <section
          className="flex w-full flex-col border-b px-4 lg:w-auto lg:min-w-max lg:shrink-0 lg:border-r lg:border-b-0"
          style={{ borderColor: BORDER, background: "#fff" }}
        >
          <nav className="flex w-full flex-1 flex-col px-1">
            <div className="flex flex-row gap-x-2 lg:mt-8 lg:shrink-0 lg:flex-col lg:gap-x-0">
              {NAV.map((item) => (
                <SidebarLink key={item.href} {...item} active={pathname === item.href} />
              ))}
            </div>

            {/* Pinned to the bottom, and the two are held apart on purpose: an
                action with no undo should not sit under the one people use
                daily. */}
            <div className="mt-4 flex flex-row gap-x-2 lg:mt-auto lg:mb-4 lg:shrink-0 lg:flex-col lg:gap-x-0">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className={`${foot} text-[#0a0a0a] hover:text-[#0a0a0a]/40`}
              >
                <span className="mr-2 flex h-6 w-6 items-center justify-center">
                  <LogOutIcon size={22} />
                </span>
                {loggingOut ? "Logging out…" : "Log out"}
              </button>

              <button
                type="button"
                disabled
                className={`${foot} gap-2 text-[#f87171] hover:text-[#f87171]/80`}
              >
                <span className="mr-2 flex h-6 w-6 items-center justify-center">
                  <UserXIcon size={22} />
                </span>
                Delete Account
                <Soon />
              </button>
            </div>
          </nav>
        </section>

        <section className="min-w-0 flex-1 px-4 pt-6 pb-16 sm:px-8 lg:px-[60px] lg:pt-10">
          {children}
        </section>
      </div>
    </div>
  );
}

/* ─── Tab heading ────────────────────────────────── */

// The reference gives each tab that is not "My Account" a large heading with
// the same hairline that closes the identity block.
export function TabHeading({ children }) {
  return (
    <h1
      className="w-full border-b pb-6 text-[36px] leading-10 font-semibold"
      style={{ borderColor: BORDER, color: INK }}
    >
      {children}
    </h1>
  );
}
