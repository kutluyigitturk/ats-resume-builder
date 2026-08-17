# ATS Resume Builder

A resume builder with ATS-friendly templates, live A4 preview and PDF export.
Next.js App Router, JavaScript (not TypeScript), Tailwind v4, deployed on Vercel.

## Working agreement

- **Never commit or push.** Propose changes; the owner reviews and pushes.
- Explanations to the owner in **Turkish**. Code, comments and commit messages in **English**.
- Code comments are short and explain **why**, not what. No comment restating the line below it.
- `npm run lint` and `npx prettier --check .` must pass before anything is handed over.
- Six pre-existing `react-hooks/set-state-in-effect` errors are known and out of scope
  (`dashboard/page.js`, `TemplateModal.js`, `CVPreview.js`, `useLocalStorage.js`).
  Do not "fix" them as a side effect of unrelated work.

## Stack

| Area | Choice |
| --- | --- |
| Database | Neon Postgres (Frankfurt, `eu-central-1`) |
| ORM | Prisma **6.19.3, pinned** |
| Password hashing | `@node-rs/argon2` (argon2id) |
| Sessions | Hand-rolled, database-backed |
| Email | Resend, with a console fallback |
| PDF | `puppeteer-core` + `@sparticuz/chromium` in production |

## Architecture decisions

These were deliberate. Revisit them explicitly, don't drift away from them.

**Prisma pinned to 6.x.** Prisma 7 requires driver adapters, a `prisma.config.ts`,
an explicit generator `output`, and manual dotenv loading, and has known module
resolution problems with Next.js 16 + Turbopack. Upgrade only as its own task.

**Environment variables live in `.env`, not `.env.local`.** The Prisma CLI only reads
`.env`. `.gitignore` covers `.env*`. Two URLs: `DATABASE_URL` is the pooled endpoint
(app), `DIRECT_URL` is unpooled (migrations).

**No Auth.js / NextAuth.** v5 is still `5.0.0-beta` after years, and its Credentials
provider forces JWT sessions. Sessions are implemented in `src/lib/session.js`:
a 256-bit random token in an httpOnly cookie, only its SHA-256 hash in the database.
Database-backed so a login can be revoked instantly.

**SHA-256 for session and email tokens, argon2id for passwords.** Passwords are short
and guessable, so they need a deliberately slow hash. Tokens are 256 bits of randomness
and are checked on every request, so a fast hash is correct there.

**Email verification tokens are reusable until they expire; password reset tokens are
single-use.** Mail servers and security scanners fetch every link in an email before the
recipient sees it. Burning a verification token that way locks the user out, and
re-confirming an address is harmless. `checkToken` vs `consumeToken` in `src/lib/tokens.js`.

**Login checks the password before it checks `emailVerified`.** Reversing the order would
tell anyone who guesses an address whether it is registered.

**Login errors stay at form level; signup errors attach to fields.** Pinning
"Email or password is incorrect" to a field would reveal which half was right.

**Resumes still live in `localStorage`** (`src/lib/resumeManager.js`), not in the database.
The `Resume` model exists and is unused. Migrating it is a known, deliberately deferred task.

## Layout

```
src/app/api/auth/          signup · login · logout · me
                           verify-email · resend-verification
                           forgot-password · reset-password
src/app/dashboard/layout.js   server-side auth gate for everything under /dashboard
src/lib/prisma.js          PrismaClient singleton (hot-reload safe)
src/lib/session.js         createSession · getCurrentUser · destroySession
src/lib/tokens.js          issueToken · consumeToken · checkToken
src/lib/email.js           Resend wrapper; logs the link when RESEND_API_KEY is unset
src/components/AuthField.js  label + input + inline error + aria wiring
src/lib/shake.js           error nudge, skipped under prefers-reduced-motion
```

## Conventions

- Protect routes with a server component (`layout.js` calling `getCurrentUser`), never a
  client-side redirect: a logged-out visitor must never receive the markup.
- Never mutate during render. A page render can run more than once.
- Form errors render inline next to their field with `aria-invalid` + `aria-describedby`,
  and submit moves focus to the first invalid field. A red border alone is not an error message.
- Error copy says how to fix the problem. No "Oops", no exclamation marks.
- Motion is never the only feedback channel, and every animation respects
  `prefers-reduced-motion`.
- Validate on the server. Client-side checks are for convenience only.
- Rely on database constraints over check-then-write (`P2002`, conditional `updateMany`)
  so concurrent requests cannot race.

## Not done yet

- Resumes are not in the database, so an account carries nothing between devices.
- No production database. Vercel has no `DATABASE_URL`, so every auth route 500s in
  production. A second Neon project is needed.
- Resend is not configured. `onboarding@resend.dev` only delivers to the account owner's
  own address; sending to real users needs a verified domain.
- Pricing page tiers are not enforced anywhere. `User.plan` exists and is always `FREE`.
- No payment provider. Stripe does not support Turkey-registered businesses; the options
  are a merchant of record (Paddle, Polar) or a local gateway (iyzico, PayTR).
- AI features are unbuilt. **They must not ship without a per-user quota checked
  server-side** - an unmetered AI endpoint is an unbounded bill.
- "Continue with Google" buttons on login and signup are not wired up.
