"use client";

import { useState } from "react";
import Link from "next/link";
import AvatarEditor from "@/components/account/AvatarEditor";
import NameField from "@/components/account/NameField";
import { BORDER, INK, MUTED, MUTED_FG, Soon } from "@/components/account/AccountShell";
import { useSessionUser } from "@/components/SessionUser";
import {
  CheckIcon,
  CreditCardSolidIcon,
  DollarSolidIcon,
  LockSolidIcon,
  MailSolidIcon,
} from "@/icons";

/* ─── Info card ──────────────────────────────────── */

// The reference's card to the pixel: 12px radius, a hairline border, a
// one-pixel shadow, a 200px floor, and a 24/20 body laying the icon beside the
// text block on a shared centre line.
function InfoCard({ icon, label, children, action }) {
  return (
    <div
      className="flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-xl border"
      style={{ borderColor: BORDER, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
    >
      <div className="flex flex-row items-center gap-4 px-5 py-6">
        <span className="shrink-0 text-blue-600">{icon}</span>
        <div className="flex min-w-0 flex-grow flex-col">
          <p className="mb-2 text-[16px] leading-6" style={{ color: MUTED_FG }}>
            {label}
          </p>
          <div
            className="min-h-[26px] text-[18px] leading-[26px] font-semibold"
            style={{ color: INK }}
          >
            {children}
          </div>
        </div>
      </div>

      {action}
    </div>
  );
}

// 45px: a 44px control plus the hairline above it, the way the reference
// stacks a h-11 button inside the band.
function CardAction({ href, label }) {
  const base =
    "flex h-[45px] w-full items-center justify-center gap-2 border-t px-6 text-[14px] leading-[21px] font-medium";
  const style = { borderColor: BORDER, background: MUTED };

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} text-blue-700 underline-offset-4 hover:underline`}
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
      className={`${base} cursor-not-allowed`}
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
    <>
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
          icon={<MailSolidIcon size={30} />}
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
          icon={<LockSolidIcon size={30} />}
          label="Password"
          action={<CardAction label="Change Password" />}
        >
          {/* A fixed run of dots. Matching the real length would hand a
              shoulder-surfer the one thing that narrows a guess. */}
          <span className="tracking-[0.18em]">••••••••••</span>
        </InfoCard>

        <InfoCard
          icon={<DollarSolidIcon size={30} />}
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
          icon={<CreditCardSolidIcon size={30} />}
          label="Payment Method"
          action={<CardAction label="Manage Subscriptions" />}
        >
          {/* Blank until there is a card on file - this account has none, and
              a value here would be the card saying something untrue. The row
              keeps its height so the card does not shrink beside its
              neighbour. */}
          <span className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate" />
            {/* Stands in for the Stripe mark until the real asset is in the
                repo; a hand-drawn wordmark would be a worse likeness. */}
            <span className="shrink-0 text-[15px] font-bold" style={{ color: "#635bff" }}>
              stripe
            </span>
          </span>
        </InfoCard>
      </section>
    </>
  );
}
