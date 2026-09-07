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

// Read off the reference's own computed styles rather than guessed from a
// screenshot. It is the neutral scale - pure greys, no blue or warm cast - and
// the page ground really is white; there is no tinted canvas anywhere on it.
const BORDER = "#e5e5e5"; // neutral-200
const MUTED = "#f5f5f5"; // neutral-100: card footers, the active nav pill, the avatar ring
const MUTED_FG = "#737373"; // neutral-500
const INK = "#0a0a0a"; // neutral-950

/* ─── Soon badge ─────────────────────────────────── */

// Changing an address, changing a password and closing an account each need
// their own server-side design, so none of them is wired up yet. Saying "Soon"
// in words is the honest version of a button that looks ready and does
// nothing - and it is text, not just a colour.
function Soon() {
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

// 44px tall, 12px radius, a 24px icon 12px from its label - measured off the
// reference, not eyeballed. The active row is the only filled one.
function SidebarLink({ href, icon, label, active = false }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="my-1 flex h-11 items-center rounded-xl px-4 text-[16px] transition-colors"
      style={{
        background: active ? MUTED : "transparent",
        color: active ? "var(--color-blue-700)" : MUTED_FG,
        fontWeight: active ? 600 : 400,
      }}
    >
      <span className="mr-3 flex h-6 w-6 items-center justify-center">{icon}</span>
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

  const foot =
    "flex h-10 cursor-pointer items-center px-6 text-[16px] whitespace-nowrap transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section
      className="flex w-full shrink-0 flex-col border-b px-4 lg:w-[272px] lg:border-r lg:border-b-0"
      style={{ borderColor: BORDER, background: "#fff" }}
    >
      <nav className="flex flex-row gap-x-2 px-1 lg:mt-8 lg:flex-col lg:gap-x-0">
        <SidebarLink href="/account" icon={<HomeIcon size={22} />} label="My Account" active />
        <SidebarLink href="/dashboard" icon={<FileTextIcon size={22} />} label="My Resumes" />
      </nav>

      {/* Pinned to the bottom, and the two are held apart on purpose: an
          action with no undo should not sit under the one people use daily. */}
      <div className="mt-4 flex flex-row gap-x-2 px-1 pb-4 lg:mt-auto lg:flex-col lg:gap-x-0">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={foot}
          style={{ color: INK }}
        >
          <span className="mr-2 flex h-6 w-6 items-center justify-center">
            <LogOutIcon size={22} />
          </span>
          {loggingOut ? "Logging out…" : "Log out"}
        </button>

        <button type="button" disabled className={`${foot} gap-2 text-red-600`}>
          <span className="mr-2 flex h-6 w-6 items-center justify-center">
            <UserXIcon size={22} />
          </span>
          Delete Account
          <Soon />
        </button>
      </div>
    </section>
  );
}

/* ─── Info card ──────────────────────────────────── */

// The reference's card to the pixel: 12px radius, a hairline border, a
// one-pixel shadow, a 200px floor, and a 24/20 body laying the icon beside the
// text block on a shared centre line.
function InfoCard({ icon, label, children, action }) {
  return (
    <div
      className="flex min-h-[200px] flex-col overflow-hidden rounded-xl border"
      style={{ borderColor: BORDER, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
    >
      <div className="flex flex-1 flex-row items-center gap-4 px-5 py-6">
        <span className="shrink-0 text-blue-700">{icon}</span>
        <div className="flex min-w-0 flex-grow flex-col">
          <p className="text-[16px] leading-6" style={{ color: MUTED_FG }}>
            {label}
          </p>
          <div className="text-[20px] leading-8 font-semibold" style={{ color: INK }}>
            {children}
          </div>
        </div>
      </div>

      {action}
    </div>
  );
}

// A filled band, not more white: 45px tall, the same neutral-100 as the active
// nav pill, separated by the same hairline as everything else.
function CardAction({ href, label }) {
  const base = "flex h-[45px] w-full items-center justify-center gap-2 border-t text-[14px]";
  const style = { borderColor: BORDER, background: MUTED };

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} font-medium text-blue-700 transition-[filter] hover:brightness-95`}
        style={style}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`${base} cursor-not-allowed font-medium`}
      style={{ ...style, color: MUTED_FG }}
    >
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
    <div className="min-h-screen" style={{ background: "#fff", color: INK }}>
      <Navbar maxWidth="1280px" baseRingClass="ring-slate-200/50" justify="justify-between">
        <Logo />
        <UserMenu />
      </Navbar>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col pt-20 lg:min-h-screen lg:flex-row">
        <Sidebar />

        <section className="min-w-0 flex-1 px-4 pt-6 sm:px-8 lg:px-[60px] lg:pt-10">
          {/* Identity. The name inherits 36px/600 from this block, the way the
              reference sets it on the wrapper rather than on the heading. */}
          <section
            className="flex w-full flex-col items-center justify-center border-b pb-6 pl-2"
            style={{ borderColor: BORDER, fontSize: 36, fontWeight: 600, lineHeight: "40px" }}
          >
            <AvatarEditor
              name={user.name}
              email={user.email}
              version={avatarVersion}
              onVersionChange={setAvatarVersion}
            />

            <div className="mt-3 flex w-full flex-col items-center">
              <NameField name={name} onSaved={setName} />
              <p
                className="mt-2 max-w-full truncate text-center text-[16px] leading-6 font-semibold"
                style={{ color: MUTED_FG }}
              >
                {user.email}
              </p>
            </div>
          </section>

          {/* Cards */}
          <section className="mb-7 grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
            <InfoCard
              icon={<MailIcon size={30} />}
              label="Email"
              action={<CardAction label="Change Email" />}
            >
              <span className="flex items-center gap-2">
                <span className="min-w-0 truncate">{user.email}</span>
                {user.emailVerified && (
                  <span
                    title="Verified"
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
                  >
                    <CheckIcon size={10} />
                    <span className="sr-only">Verified</span>
                  </span>
                )}
              </span>
            </InfoCard>

            <InfoCard
              icon={<LockIcon size={30} />}
              label="Password"
              action={<CardAction label="Change Password" />}
            >
              {/* A fixed run of dots. Matching the real length would hand a
                  shoulder-surfer the one thing that narrows a guess. */}
              <span className="tracking-[0.18em]">•••••••••</span>
            </InfoCard>

            <InfoCard
              icon={<DollarSignIcon size={30} />}
              label="Plan"
              action={<CardAction href="/pricing" label="Change Plan" />}
            >
              <span className="flex flex-wrap items-center gap-3">
                {plan}
                <Link
                  href="/pricing"
                  className="rounded-full bg-blue-700 px-4 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Upgrade
                </Link>
              </span>
            </InfoCard>

            <InfoCard
              icon={<CreditCardIcon size={30} />}
              label="Payment Method"
              action={<CardAction label="Add Payment Method" />}
            >
              None
            </InfoCard>
          </section>
        </section>
      </div>
    </div>
  );
}
