# TrocaCopa

> A free sticker-album tracker for the FIFA World Cup 2026 — track what you have, what you're missing, and share your collection with other collectors. Built mobile-first as an installable PWA.

**By Lucas da Silva Santos — Full Stack Developer**

🌎 **[Live demo](https://troca-copa-26.vercel.app)**

---

## Overview

Every World Cup, millions of people fill a physical sticker album and end up with a drawer full of duplicates and no good way to track what they still need or who to trade with. TrocaCopa moves that whole ritual to the phone: mark each of the 993 stickers as owned or missing, watch your completion percentage climb, count your duplicates, and share a public link so other collectors can find you.

The whole product is **free**: album tracking, duplicate management, and a public collector profile designed so every shared link is organic acquisition.

---

## What It Does

**Album Tracking**
All 993 stickers — 48 national teams × 20, plus the FIFA World Cup History and Coca-Cola special sets — with real country flags served from a CDN. Tap to mark owned/missing, use +/− to register duplicates, filter by group (A–L + Especial) and by status, and "complete a whole team" in one tap. Optimistic UI updates instantly and reconciles with the server.

**Progress & Stats**
Live completion percentage, per-team progress bars, and counts of owned / missing / duplicate stickers on a dashboard.

**Duplicates for Trading**
An organized list of your duplicates, grouped by team, ready to share with other collectors via WhatsApp.

**Public Collector Profile**
A shareable `/u/[slug]` page showing your completion and the stickers you're looking for — every shared link is organic marketing. No authentication required to view.

**Installable PWA**
Add to home screen on iOS or Android — no app store. Themed manifest and icons.

---

## Architecture

```
Browser ──▶ Next.js App Router (Server Components, SSR)
                 │
                 ├── Server Actions  (mutations only — userId from session)
                 ├── Server-only queries (reads — never exposed as endpoints)
                 │
                 └──▶ Drizzle ORM ──▶ Neon (serverless PostgreSQL)
```

Reads and writes are deliberately split: mutations are Server Actions that derive the user id from the session, while reads live in a server-only query module that is never exposed as an endpoint. The UI only renders what the server decided to send.

### Routes

```
/                    Public landing
/sign-in, /sign-up   Auth
/dashboard           Collector dashboard
/album               Full album with group/status filters
/repetidas           Duplicates list
/perfil              Profile editing
/u/[slug]            Public profile (no authentication)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, oklch design tokens |
| Auth | better-auth (session-based) |
| Database | PostgreSQL (Neon — serverless) |
| ORM | Drizzle ORM + drizzle-kit |
| PWA | @ducanh2912/next-pwa |
| Testing | Vitest |
| Deploy | Vercel |

---

## Engineering Highlights

**Closing an IDOR by construction.**
Read functions were initially Next.js Server Actions (`'use server'`), which exposes them as callable RPC endpoints — meaning a client could request any user's collection by passing an arbitrary id. I moved all reads into a server-only query module so they're no longer reachable as endpoints, and kept mutations as actions that derive the user id from the session. Multi-tenant isolation is enforced by construction, not by convention.

**Rebrand with zero component churn.**
The visual identity (Brazilian flag palette) is defined entirely as semantic `oklch` design tokens. Re-theming the whole app meant editing tokens, not components — every button, badge and gradient inherited the new colors automatically.

---

## Security

- **Multi-tenant writes:** every mutation derives `userId` from the authenticated session — a user can only ever modify their own data.
- **No read IDOR:** data reads are server-only functions, not exposed actions.
- **No PII leakage:** email is never sent to public pages.
- **Input hardening:** sticker codes are validated against the catalog and counts are clamped server-side.
- **Rate limiting:** mutating actions are rate-limited per user (in-memory, per instance).
- **Security headers:** CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local   # edit with your real values

# 3. Push the schema to your database
npx drizzle-kit push

# 4. Start the dev server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon (PostgreSQL) connection string |
| `BETTER_AUTH_SECRET` | Long random string (32+ chars) |
| `BETTER_AUTH_URL` | Public app URL (local: `http://localhost:3000`) |

### Database

The schema in [`lib/db/schema.ts`](./lib/db/schema.ts) is the source of truth, synced with `drizzle-kit push` (no versioned migration files):

```
user / session / account / verification   — better-auth tables
profile        — public collector profile (1:1 with user)
sticker_entry  — user's stickers (userId, stickerCode, count)
```

`sticker_entry` has a unique constraint on `(userId, stickerCode)`, required by the album's optimistic upsert.

---

## Testing

Vitest, with coverage focused on the logic that matters:

- **Catalog integrity** — 993 stickers across 50 sets, groups A–L + Especial.
- **Statistics** — completion, per-team progress, missing/duplicate computation.
- **Rate limiting** — window, blocking, expiry, and per-user isolation.

```bash
npm test
```

---

## Roadmap

- **Custom domain** and a per-profile Open Graph image for richer link previews.
- **Trade matching** — surface collectors whose duplicates fill your gaps (and vice-versa).
- Revisit "public by default" with an explicit share-to-publish flow.

---

## Author

**Lucas da Silva Santos** — Full Stack Developer
Building production software end-to-end: product, architecture, and deploy.

> Not affiliated with FIFA, Panini, or Coca-Cola.
