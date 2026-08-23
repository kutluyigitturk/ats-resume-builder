# ATS Resume Builder

A resume builder with ATS-friendly templates, live A4 preview and PDF export.
Next.js App Router, JavaScript (not TypeScript), Tailwind v4, deployed on Vercel.

## Working agreement

- **Commit and push only when the owner asks for it**, never on your own initiative and
  never for a change they have not seen yet. When they do ask: run `npm run lint` first,
  write a Conventional Commits message, and push to `main`. If lint fails, fix it and say
  so before pushing.
- Explanations to the owner in **Turkish**. Code, comments and commit messages in **English**.
- Code comments are short and explain **why**, not what. No comment restating the line below it.
- `npm run lint` and `npx prettier --check .` must pass before anything is handed over.
- Six pre-existing `react-hooks/set-state-in-effect` errors are known and out of scope
  (`dashboard/page.js`, `TemplateModal.js`, `CVPreview.js`, `useLocalStorage.js`).
  Do not "fix" them as a side effect of unrelated work.

## Stack

| Area             | Choice                                                 |
| ---------------- | ------------------------------------------------------ |
| Database         | Neon Postgres (Frankfurt, `eu-central-1`)              |
| ORM              | Prisma **6.19.3, pinned**                              |
| Password hashing | `@node-rs/argon2` (argon2id)                           |
| Sessions         | Hand-rolled, database-backed                           |
| Email            | Resend, with a console fallback                        |
| PDF              | `puppeteer-core` + `@sparticuz/chromium` in production |

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

**A rejected field is named by the server, not guessed from its message.**
Validation responses carry `{ error, field }` and the form attaches the message
to that input. Matching on message text breaks silently the next time a word
changes. Login is the exception and sends no `field`, on purpose.

**Rate limits live in the database, not in memory.** Every serverless instance
has its own memory and is recycled constantly, so an in-process counter is
reset by an attacker simply spreading requests around. `src/lib/rateLimit.js`
keeps one row per (bucket, key); Postgres resolves the increment, so two
simultaneous requests cannot read the same number and write it back.

**The tight login limit is keyed on email _and_ IP.** Locking an address after
a few failures hands anyone who knows an email a way to keep its owner out on
demand - the limiter becomes the attack. Keyed on the pair, a stranger failing
repeatedly locks out only themselves. A much looser per-email bucket stays as
the backstop for guessing spread across many addresses.

**The mail endpoints fail silently when limited.** `forgot-password` answers
the same way whether or not it sent anything; a "too many attempts" reply for
one address and a normal one for another would rebuild exactly the account
check the generic answer exists to prevent.

**Password rules reject the indefensible, they do not score.** `checkPassword`
in `src/lib/password.js` turns down the handful of passwords that break in
seconds, anything containing the address it protects, and near-single-character
strings. No composition rules: "one capital, one symbol" pushes people towards
Password1! without making anything harder to guess. The same function runs in
the browser, so the form can never promise something the server refuses.

**Reset tokens are read before they are spent.** A single-use token consumed
ahead of password validation would leave a user holding a dead link and no way
back in, so `checkToken` gates the password check and `consumeToken` runs only
once the new password is known to be acceptable.

**The PDF embeds one merged font file per face, never a subset.** `@fontsource`
splits every family into disjoint subsets, and embedding two of them makes the
renderer swap fonts mid-word on ğ, İ or ş - the text layer then comes out as
"Türkyi|ğ|it" and an ATS reads a broken name. Measured: subsets give 2/7 phrases
intact, one merged file gives 7/7. `scripts/build-pdf-fonts.py` merges latin and
latin-ext per face into `assets/pdf-fonts/`; the output is committed, so a
deploy needs neither Python nor fonttools.

**Lato was removed from the font list.** Google's build of it has no ğ, İ, ş, Ş
or Ğ at all - not in the subsets and not in the full TTF - so a Turkish name
could not be set in it. Montserrat replaced it, and `RETIRED_FONTS` in
`useStyleSettings.js` moves resumes that were already saved with Lato.

**The professional template keeps its letter-spacing, knowingly.** Above about
1.5px, tracking makes a PDF text extractor read "S t a j y e r"; the template
uses 1.5-3px on the name, the title and the section headings. The look was
chosen over extraction for that one template. The other two templates use no
tracking and extract cleanly.

**Date fields take digits only; "still ongoing" is a checkbox.** A field that
accepts free text does not tell the user what belongs in it, and a single
keystroke used to destroy the word "Present" already sitting there. `ONGOING`
in `DateInput.js` is the stored value, so both renderers keep printing a plain
string.

**`/api/generate-pdf` requires a session and refuses every outgoing request.**
It renders caller-supplied HTML in a real browser on our server, which without
a gate is both free CPU and a way to reach addresses only the server can see.
The resume HTML is self-contained - inline SVG, system fonts - so every network
request it makes is one we did not put there, and all of them are aborted.

**Resumes still live in `localStorage`** (`src/lib/resumeManager.js`), not in the database.
The `Resume` model exists and is unused. Migrating it is a known, deliberately deferred task.

## Layout

```
src/app/api/auth/          signup · login · logout · me
                           verify-email · resend-verification
                           forgot-password · reset-password
src/app/(auth)/            login · signup · forgot-password, behind one layout
                           that bounces anyone already signed in to /dashboard.
                           The parentheses keep the folder out of the URL.
src/app/dashboard/layout.js   server-side auth gate for everything under /dashboard
src/app/builder/layout.js     the same gate for the editor
src/lib/prisma.js          PrismaClient singleton (hot-reload safe)
src/lib/session.js         createSession · getCurrentUser · destroySession
                           requireUser · redirectIfAuthenticated
src/lib/tokens.js          issueToken · consumeToken · checkToken
src/lib/rateLimit.js       hitRateLimit · clearRateLimit · clientIp
src/lib/pdfFonts.js        embeds the chosen font into the exported HTML
assets/pdf-fonts/          merged woff2 faces, built by scripts/build-pdf-fonts.py
src/lib/password.js        checkPassword, shared by the server and the forms
src/lib/email.js           Resend wrapper; logs the link when RESEND_API_KEY is unset
src/components/AuthField.js  label + input + inline error + aria wiring
src/components/SocialSoon.js disabled Google button, until OAuth is wired up
src/lib/shake.js           error nudge, skipped under prefers-reduced-motion
```

`/reset-password` and `/verify-email` sit outside the `(auth)` group: both are
reached from a link in an email, and a signed-in user following one still has a
real reason to be there.

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
- "Continue with Google" is not wired up. The buttons render disabled with a
  "Soon" badge (`SocialSoon`) rather than looking ready and doing nothing.
  Wiring it needs a Google Cloud client ID and secret, and OAuth columns on `User`.
- The three templates are written twice - as JSX in `CVPreview.js` and as HTML
  strings in `pdfHtmlBuilder.js`. Every template change has to be made in both,
  so the preview and the PDF will drift apart eventually. Merging them is a
  real refactor, not a cleanup.
- `prettier --check .` still fails on the older builder code. `.prettierrc` is
  in place and everything under `src/app/(auth)`, `src/lib` auth files and the
  API routes conform; the rest is formatted as it is touched.
- No account settings page: a signed-in user cannot change their password,
  their name, or close the account.

- **Resume storage is not scoped to an account, and the owner has deliberately
  deferred this.** The `cv-*` keys in `localStorage` carry no user id, and logging
  out clears only the server session. On a shared computer, the next person to log
  in sees the previous person's resumes and can open, export or delete them. It is
  parked because the site has no real users yet, not because it is acceptable.
  Do not ship to real users with this open, and do not "solve" it by wiping
  `localStorage` on logout - resumes exist nowhere else, so that trades a leak for
  data loss. The fix is to stamp the store with the owner's user id and clear it
  **on login when the stamp does not match** - which is the same scoping the
  database migration needs anyway. Raise it before any production launch.
