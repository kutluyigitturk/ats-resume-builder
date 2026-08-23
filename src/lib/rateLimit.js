import { prisma } from "@/lib/prisma";

// Vercel puts the client address first in this header and appends the proxies
// it passed through. Everything after the first entry is ours, not theirs.
export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.headers.get("x-real-ip") ?? "unknown";
}

// Counts one attempt and says whether it is still within the allowance.
//
// The counter is a single row per (bucket, key) holding a count and the moment
// the current window closes. `increment` is resolved by Postgres, so two
// requests arriving together cannot both read the same number and write it
// back - the classic way a naive limiter is bypassed.
export async function hitRateLimit(bucket, key, { limit, windowMs }) {
  const now = new Date();
  const windowEnds = new Date(now.getTime() + windowMs);

  // Reopen an expired window before counting. Conditional on windowEnds so a
  // window that is still open is never reset by a concurrent request.
  await prisma.rateLimit.updateMany({
    where: { bucket, key, windowEnds: { lte: now } },
    data: { count: 0, windowEnds },
  });

  const record = await prisma.rateLimit.upsert({
    where: { bucket_key: { bucket, key } },
    create: { bucket, key, count: 1, windowEnds },
    update: { count: { increment: 1 } },
    select: { count: true, windowEnds: true },
  });

  const allowed = record.count <= limit;
  const retryAfterSeconds = Math.max(1, Math.ceil((record.windowEnds - now) / 1000));

  return { allowed, retryAfterSeconds };
}

// Called after a successful login. Without this, someone who knows an address
// could keep it locked out forever by failing on purpose - the limiter would
// become the attack instead of the defence.
export async function clearRateLimit(bucket, key) {
  await prisma.rateLimit.deleteMany({ where: { bucket, key } });
}

// One message for every limit we enforce. It says what to do (wait) and for
// how long, and deliberately never says which limit was hit.
export function tooManyAttempts(retryAfterSeconds) {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  const wait = minutes <= 1 ? "a minute" : `${minutes} minutes`;

  return Response.json(
    { error: `Too many attempts. Wait ${wait} and try again.` },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
