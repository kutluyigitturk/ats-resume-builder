import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

// Without an API key nothing is sent - the link is printed to the server
// terminal instead. That keeps the whole flow testable before Resend is set up,
// and means a missing key never breaks signup.
async function send({ to, subject, html, link }) {
  if (!process.env.RESEND_API_KEY) {
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

function layout(heading, body, buttonLabel, buttonUrl) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0b1220">
  <h1 style="font-size:22px;margin:0 0 12px">${heading}</h1>
  <p style="font-size:15px;line-height:1.6;color:#5b6472;margin:0 0 24px">${body}</p>
  <a href="${buttonUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 24px;border-radius:10px">${buttonLabel}</a>
  <p style="font-size:13px;line-height:1.6;color:#8a93a0;margin:24px 0 0">Or paste this link into your browser:<br><span style="word-break:break-all">${buttonUrl}</span></p>
</div>`;
}

export async function sendVerificationEmail(to, token) {
  const url = `${APP_URL}/verify-email?token=${token}`;

  await send({
    to,
    subject: "Verify your email",
    link: url,
    html: layout(
      "Verify your email",
      "Confirm this address to finish setting up your account. This link expires in 24 hours.",
      "Verify email",
      url
    ),
  });
}

export async function sendPasswordResetEmail(to, token) {
  const url = `${APP_URL}/reset-password?token=${token}`;

  await send({
    to,
    subject: "Reset your password",
    link: url,
    html: layout(
      "Reset your password",
      "Someone asked to reset the password for this account. This link expires in 1 hour and can be used once. If it wasn't you, ignore this email - nothing changes.",
      "Choose a new password",
      url
    ),
  });
}
