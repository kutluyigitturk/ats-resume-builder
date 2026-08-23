import { Resend } from "resend";
import { escapeHtml } from "@/lib/htmlEscape";

const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

// Every link we mail is built from this. Falling straight back to localhost
// would send real recipients a link to their own machine, and nothing would
// report an error: Resend succeeds, the token is valid, the user is simply
// locked out. Vercel injects the deployment's own domain, so use that before
// giving up and assuming a development machine.
const APP_URL =
  process.env.APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Without an API key nothing is sent - the link is printed to the server
// terminal instead. That keeps the whole flow testable before Resend is set up,
// and means a missing key never breaks signup.
async function send({ to, subject, html, link }) {
  if (!process.env.RESEND_API_KEY) {
    // The link carries a raw, unhashed token. That is fine on a development
    // machine and unacceptable in a runtime log, so production says only that
    // mail is unconfigured - loudly, because nobody can sign up without it.
    if (process.env.NODE_ENV === "production") {
      console.error(`Email NOT sent to ${to}: RESEND_API_KEY is not set.`);
      return;
    }

    console.log(
      [
        "",
        "=".repeat(70),
        `EMAIL (not sent - RESEND_API_KEY missing)`,
        `To:      ${to}`,
        `Subject: ${subject}`,
        "",
        link,
        "=".repeat(70),
        "",
      ].join("\n")
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });

  // Logged, not thrown: a failed email must not turn a successful signup into
  // an error the user sees.
  if (error) console.error("Email send failed:", error);
}

function layout(heading, body, buttonLabel, buttonUrl, name) {
  // The name is whatever the user typed at signup, so it is escaped like any
  // other untrusted string before it goes into markup.
  const greeting = name
    ? `<p style="font-size:15px;line-height:1.6;color:#0b1220;margin:0 0 12px">Hi ${escapeHtml(name)},</p>`
    : "";

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0b1220">
  <h1 style="font-size:22px;margin:0 0 12px">${heading}</h1>
  ${greeting}
  <p style="font-size:15px;line-height:1.6;color:#5b6472;margin:0 0 24px">${body}</p>
  <a href="${buttonUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 24px;border-radius:10px">${buttonLabel}</a>
  <p style="font-size:13px;line-height:1.6;color:#8a93a0;margin:24px 0 0">Or paste this link into your browser:<br><span style="word-break:break-all">${buttonUrl}</span></p>
</div>`;
}

export async function sendVerificationEmail(to, token, name) {
  const url = `${APP_URL}/api/auth/verify-email?token=${token}`;

  await send({
    to,
    subject: "Verify your email",
    link: url,
    html: layout(
      "Verify your email",
      "Confirm this address to finish setting up your account. This link expires in 24 hours.",
      "Verify email",
      url,
      name
    ),
  });
}

export async function sendPasswordResetEmail(to, token, name) {
  const url = `${APP_URL}/reset-password?token=${token}`;

  await send({
    to,
    subject: "Reset your password",
    link: url,
    html: layout(
      "Reset your password",
      "Someone asked to reset the password for this account. This link expires in 1 hour and can be used once. If it wasn't you, ignore this email - nothing changes.",
      "Choose a new password",
      url,
      name
    ),
  });
}
