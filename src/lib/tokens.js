import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

// A reset token can take over an account, so it lives a short life.
// A verification token is harmless by comparison and can wait a day.
const TTL_MINUTES = {
  EMAIL_VERIFY: 60 * 24,
  PASSWORD_RESET: 60,
};

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

// Returns the raw token to put in the email link. Only its hash is stored,
// so a leaked database hands out no working links.
export async function issueToken(userId, type) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_MINUTES[type] * 60 * 1000);

  // Drop this user's older unused tokens of the same kind, so an email that
  // is still sitting in an inbox cannot be replayed after a newer request.
  await prisma.token.deleteMany({ where: { userId, type, usedAt: null } });

  await prisma.token.create({
    data: { userId, type, tokenHash: hashToken(token), expiresAt },
  });

  return token;
}

// Spends a token. Returns the user id on success, null on anything else.
export async function consumeToken(rawToken, type) {
  if (!rawToken) return null;

  const record = await prisma.token.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    select: { id: true, userId: true, type: true, expiresAt: true, usedAt: true },
  });

  if (!record) return null;
  if (record.type !== type) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;

  // The `usedAt: null` condition makes this atomic: if two requests arrive at
  // once, only one of them updates a row and the other gets count 0.
  const claimed = await prisma.token.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  if (claimed.count === 0) return null;

  return record.userId;
}

// Valid until it expires, and usable more than once on purpose. Mail servers
// and security tools fetch every link in an email before the recipient sees
// it; a single-use token would already be spent by the time the user clicks.
// Confirming an address that is already confirmed changes nothing, so there
// is no reason to spend it.
export async function checkToken(rawToken, type) {
  if (!rawToken) return null;

  const record = await prisma.token.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    select: { userId: true, type: true, expiresAt: true },
  });

  if (!record) return null;
  if (record.type !== type) return null;
  if (record.expiresAt < new Date()) return null;

  return record.userId;
}
