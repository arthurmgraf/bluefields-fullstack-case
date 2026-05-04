# Startup Tracker

> **Live demo:** _set after deploy_ → `https://<your-app>.vercel.app`
> **Stack:** Next.js 14 · Supabase · TypeScript · Tailwind · Shadcn/UI · Zod

A portfolio-tracking MVP for accelerators and venture studios. Single source of truth for startup status, risk, and updates — replacing the "WhatsApp + email + Notion" sprawl most early-stage investors actually use.

![Screenshot placeholder](docs/screenshot.png)

---

## What it does

- **Dashboard** — Every startup as a card; risk badge, current phase, last update at-a-glance
- **Detail view** — Per-startup metadata, full update history, inline form to add new entries
- **Risk tracking** — `green / yellow / red` risk level on each update; mirrored to the parent startup
- **Auth** — Magic-link sign-in via Supabase Auth (no passwords)
- **Security** — Row-Level Security on every table; anon key alone cannot read or write
- **No client-side data fetching** — pages are React Server Components; data lives server-side
- **Type-safe end-to-end** — Zod at every Server Action boundary; zero `any` in the codebase

---

## Quick start

```bash
# 1. Install
npm install

# 2. Copy env template and fill in your Supabase credentials
cp .env.example .env.local

# 3. Run the migration in your Supabase project (SQL Editor → paste → Run)
#    File: supabase/migrations/001_initial_schema.sql

# 4. Sign up once via the app (creates your profile row)
npm run dev
# → open http://localhost:3000/login → enter your email → click magic link

# 5. (Optional) Seed sample data
#    Open Supabase SQL Editor and run: supabase/seed.sql
#    (it attributes seed startups to the first profile in the DB)

# 6. (Optional) Generate strict DB types from your live schema
#    npx supabase gen types typescript --project-id <ID> > src/lib/database.types.ts
```

---

## Deploy to Vercel

```bash
npx vercel link        # one-time
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add NEXT_PUBLIC_SITE_URL    # e.g. https://your-app.vercel.app
npx vercel deploy --prod
```

Then in Supabase → **Authentication → URL Configuration**, add the production URL to:
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/auth/callback`

---

## Project layout

```
startup-tracker/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/login/          # Magic-link sign-in
│   │   ├── auth/callback/         # OAuth/OTP callback
│   │   ├── (authed)/              # Protected app shell
│   │   │   ├── page.tsx           # Dashboard
│   │   │   └── startups/[id]/     # Detail
│   │   ├── error.tsx              # Top-level error boundary
│   │   └── not-found.tsx
│   ├── actions/                   # Server Actions (mutations)
│   │   ├── auth.ts                # signIn / signOut
│   │   ├── startups.ts            # list / get / create
│   │   └── updates.ts             # createUpdate
│   ├── components/
│   │   ├── ui/                    # Shadcn primitives
│   │   ├── startup-card.tsx       # Dashboard card
│   │   ├── update-form.tsx        # Inline new-update form
│   │   ├── update-timeline.tsx    # Detail page timeline
│   │   ├── summary-stats.tsx      # Risk count chips
│   │   ├── risk-badge.tsx         # Color-coded risk pill
│   │   ├── new-startup-form.tsx   # Inline create-startup form
│   │   └── header.tsx             # App shell header
│   └── lib/
│       ├── schemas.ts             # Zod schemas (the runtime guardrail)
│       ├── types.ts               # Shared TS types
│       ├── constants.ts           # PHASE / RISK labels and styles
│       ├── utils.ts               # cn(), date formatters
│       ├── database.types.ts      # Generated Supabase types
│       └── supabase/
│           ├── server.ts          # RSC + Server Action client
│           ├── client.ts          # Browser client
│           └── middleware.ts      # Session refresh + route gate
├── middleware.ts                  # Next.js middleware (uses lib/supabase/middleware)
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   └── seed.sql
└── docs/
    ├── PRD.md
    ├── EXECUTION_PLAN.md
    ├── AI_USAGE.md                # ← How AI was used to build this
    └── ARCHITECTURE.md
```

---

## Documentation

| Doc | What's inside |
|-----|---------------|
| [`docs/PRD.md`](docs/PRD.md) | Problem, personas, MoSCoW user stories, acceptance criteria |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System diagram, key decisions, data flow, security model |
| [`docs/AI_USAGE.md`](docs/AI_USAGE.md) | The honest AI workflow log: prompts used, what AI got wrong, how it was caught |
| [`docs/EXECUTION_PLAN.md`](docs/EXECUTION_PLAN.md) | Hour-by-hour build log + retrospective |
| [`TODO.md`](TODO.md) | Honest list of what's deferred and why |
| [`.claude/skills/code-review.md`](.claude/skills/code-review.md) | Reusable Claude Code skill for AI-assisted code review |

---

## Coding rules (non-negotiable)

1. **Zero `any`** — TypeScript strict mode + `noUncheckedIndexedAccess`
2. **Zod at every Server Action boundary** — runtime guardrail
3. **RLS on every table** — security cannot rely solely on app-level checks
4. **Server Components by default** — `'use client'` only when needed
5. **`revalidatePath` after every mutation** — cache invalidation discipline
6. **Try/catch only at I/O boundaries** — pure functions throw freely
7. **Self-documenting names** — comments only when the WHY is non-obvious

---

## License

MIT — adapt freely.
