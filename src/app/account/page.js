"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import UserMenu from "@/components/UserMenu";
import AvatarEditor from "@/components/account/AvatarEditor";
import NameField from "@/components/account/NameField";
import { useSessionUser } from "@/components/SessionUser";
import {
  CheckIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  HomeIcon,
  LockIcon,
  LogOutIcon,
  MailIcon,
  UserXIcon,
} from "@/icons";

const GROUND = "#f4f5f7";
const BORDER = "#e5e7eb";

/* ─── Soon badge ─────────────────────────────────── */

// Changing an address, changing a password and closing an account each need
// their own server-side design, so none of them is wired up yet. Saying "Soon"
// in words is the honest version of a button that looks ready and does
// nothing - and it is text, not just a colour.
function Soon() {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
      Soon
    </span>
  );
}

/* ─── Sidebar ────────────────────────────────────── */

function SidebarLink({ href, icon, label, active = false }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
        active
          ? "bg-blue-50 font-semibold text-blue-700"
          : "font-medium text-slate-500 hover:bg-white hover:text-slate-800"
      }`}
    >
      <span className={active ? "text-blue-700" : "text-slate-400"}>{icon}</span>
      {label}
    </Link>
  );
}

function Sidebar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="flex flex-wrap items-center gap-2 border-b px-4 py-4 md:w-[288px] md:shrink-0 md:flex-col md:flex-nowrap md:items-stretch md:border-r md:border-b-0 md:px-3 md:py-2"
      style={{ borderColor: BORDER }}
    >
      <nav className="flex gap-1 md:flex-col">
        <SidebarLink href="/account" icon={<HomeIcon size={17} />} label="My Account" active />
        <SidebarLink href="/dashboard" icon={<FileTextIcon size={17} />} label="My Resumes" />
      </nav>

      {/* Pushed to the far end, and the two are held apart on purpose: an
          action with no undo should not sit under the one people use daily. */}
      <div className="ml-auto flex items-center gap-1 md:mt-auto md:ml-0 md:flex-col md:items-stretch md:gap-6 md:pt-10 md:pb-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-slate-500">
            <LogOutIcon size={17} />
          </span>
          {loggingOut ? "Logging out…" : "Log out"}
        </button>

        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-red-600/70"
        >
          <span className="text-red-600/60">
            <UserXIcon size={17} />
          </span>
          Delete Account
          <Soon />
        </button>
      </div>
    </aside>
  );
}

/* ─── Info card ──────────────────────────────────── */

function InfoCard({ icon, label, children, action }) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[10px] border bg-white"
      style={{ borderColor: BORDER }}
    >
      {/* The icon sits in a left gutter centred on the label-and-value pair,
          not pinned to the label's first line - that is what made the cards
          read top-heavy against the reference. */}
      <div className="flex flex-1 flex-col px-5 pt-5 pb-6 md:min-h-[144px]">
        <div className="flex items-center gap-4">
          {/* Decoration, so it keeps the brand blue - nothing here is text. */}
          <span className="shrink-0 text-blue-600">{icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] text-slate-500">{label}</p>
            <div className="mt-1">{children}</div>
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: BORDER }} />
      {action}
    </div>
  );
}

// A tinted band rather than more white: the strip is a separate surface from
// the card body, and a hairline alone was not saying so.
//
// The text colour is set per branch, never in the shared string. Two colour
// classes on one element are decided by stylesheet order, not by the order
// they appear in the attribute - so the disabled grey would have been a coin
// toss against the base blue.
function CardAction({ href, label }) {
  const base =
    "flex w-full items-center justify-center gap-2 bg-[#f7f8f9] px-5 py-3 text-[13.5px] font-semibold transition-colors";

  if (href) {
    return (
      <Link href={href} className={`${base} text-blue-700 hover:bg-[#eef0f2]`}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" disabled className={`${base} cursor-not-allowed text-slate-400`}>
      {label}
      <Soon />
    </button>
  );
}

/* ─── Page ───────────────────────────────────────── */

export default function AccountPage() {
  const user = useSessionUser();

  // Seeded from the server and then owned locally, so uploading or removing a
  // photo repaints this page immediately; router.refresh() catches the copy in
  // the navbar, which is rendered from the layout's session.
  const [avatarVersion, setAvatarVersion] = useState(() =>
    user?.avatarUpdatedAt ? new Date(user.avatarUpdatedAt).getTime() : null
  );
  const [name, setName] = useState(user?.name ?? null);

  if (!user) return null;

  const plan = user.plan ? user.plan.charAt(0) + user.plan.slice(1).toLowerCase() : "Free";

  return (
    <div className="min-h-screen" style={{ background: GROUND }}>
      <Navbar maxWidth="1280px" baseRingClass="ring-slate-200/50" justify="justify-between">
        <Logo />
        <UserMenu />
      </Navbar>

      {/* The row sets the height so the sidebar stretches to fill it - the
          divider between the columns has to reach the bottom of the page,
          not stop wherever the shorter column happens to end. */}
      <div className="mx-auto flex max-w-[1280px] flex-col px-4 pt-24 pb-16 md:min-h-[calc(100vh-2rem)] md:flex-row md:px-6">
        <Sidebar />

        <main className="min-w-0 flex-1 md:pl-10">
          {/* Identity */}
          <div className="flex flex-col items-center pt-8 pb-7">
            <AvatarEditor
              name={user.name}
              email={user.email}
              version={avatarVersion}
              onVersionChange={setAvatarVersion}
            />

            {/* The name is the primary line whether or not it exists yet:
                "Add your name" is the same field wearing its empty state, so
                there is no second line explaining an absence. */}
            <NameField name={name} onSaved={setName} />

            <p className="mt-1.5 max-w-full truncate text-[14px] text-slate-400">{user.email}</p>
          </div>

          <div className="h-px" style={{ background: BORDER }} />

          {/* Cards */}
          <div className="mt-7 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
            <InfoCard
              icon={<MailIcon size={22} />}
              label="Email"
              action={<CardAction label="Change Email" />}
            >
              <div className="flex items-center gap-2">
                <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900">
                  {user.email}
                </p>
                {user.emailVerified && (
                  <span
                    title="Verified"
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
                  >
                    <CheckIcon size={10} />
                    <span className="sr-only">Verified</span>
                  </span>
                )}
              </div>
            </InfoCard>

            <InfoCard
              icon={<LockIcon size={22} />}
              label="Password"
              action={<CardAction label="Change Password" />}
            >
              {/* A fixed run of dots. Matching the real length would hand a
                  shoulder-surfer the one thing that narrows a guess. */}
              <p className="text-[15px] font-semibold tracking-[0.18em] text-slate-900">
                •••••••••
              </p>
            </InfoCard>

            <InfoCard
              icon={<DollarSignIcon size={22} />}
              label="Plan"
              action={<CardAction href="/pricing" label="Change Plan" />}
            >
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[15px] font-semibold text-slate-900">{plan}</p>
                <Link
                  href="/pricing"
                  className="rounded-full bg-blue-700 px-3.5 py-1 text-[12.5px] font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Upgrade
                </Link>
              </div>
            </InfoCard>

            {/* Honest for now, and the slot is already the right shape for the
                day billing exists. */}
            <InfoCard
              icon={<CreditCardIcon size={22} />}
              label="Payment Method"
              action={<CardAction label="Add Payment Method" />}
            >
              <p className="text-[15px] font-semibold text-slate-900">None</p>
            </InfoCard>
          </div>
        </main>
      </div>
    </div>
  );
}
