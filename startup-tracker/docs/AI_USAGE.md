# How I Used AI to Build This

> The honest log of where AI helped, where it slipped, and how I caught the slips. This document is the highest-signal artifact in the repo.

---

## TL;DR

Built end-to-end with **Claude Code (Opus 4.7)** as primary pair, with a strict review discipline:

- **~85%** of the code is AI-generated
- **100%** of the code was line-by-line reviewed before it was committed
- **4 substantive AI mistakes** caught in review (table below)

The trade-off I accepted: **no formal test suite at MVP.** Replaced with three guardrails — TypeScript strict, Zod at every Server Action boundary, and a manual smoke checklist anchored to the PRD acceptance criteria.

---

## My toolchain

| Tool | Role |
|------|------|
| **Claude Code (Opus 4.7)** | Primary code generator; ran the full SDD workflow (BRAINSTORM → DEFINE → DESIGN → BUILD) |
| **Cursor** | Quick local refactors and tab-completion-level edits |
| **Supabase CLI** | DB type generation: `supabase gen types typescript` |
| **gh CLI** | GitHub repo creation, PR review |
| **TypeScript strict mode** | Compiler-as-linter — catches AI hallucinated types before they ship |
| **Zod** | Runtime guardrail at every Server Action boundary |

---

## My loop (per feature)

```
   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ 1. SPEC │ ─→ │ 2. CONST│ ─→ │ 3. GEN  │ ─→ │ 4. READ │ ─→ │ 5. RUN  │
   │ in plain│    │ -RAINTS │    │ Claude  │    │ EVERY   │    │ + iter  │
   │ language│    │ as ctx  │    │ writes  │    │ LINE    │    │ if bad  │
   └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

Step 4 is the part most people skip. It is the part that matters.

---

## Specific prompts I used (verbatim)

### Prompt 1 — Server Actions

> "Create three Server Actions in `src/actions/`: `auth.ts` (signIn with Supabase magic link OTP, signOut), `startups.ts` (listStartups, getStartup, createStartup), and `updates.ts` (createUpdate that also mirrors risk_level to the parent startup row). Constraints: Next.js 14 App Router, `@supabase/ssr`, Zod from `@/lib/schemas` at the boundary, never use `any`, log failures with `console.error('<name> failed:', err.message, { context })`, return discriminated union `{ ok: true } | { ok: false, error, fieldErrors? }`. After every mutation, call `revalidatePath`."

### Prompt 2 — RLS migration

> "Write a Supabase SQL migration for three tables: `profiles`, `startups`, `startup_updates`. Constraints: `enable row level security` on each, drop-and-recreate policies so the migration is idempotent, profile auto-create trigger via `handle_new_user()`, indexes for the timeline query and dashboard ORDER BY. Phase enum constrained at table level."

### Prompt 3 — Update form

> "Create a client component `update-form.tsx` using `useTransition` to submit to the `createUpdate` Server Action. Render Zod fieldErrors next to each input. Reset form on success. No external form library — bare `<form action={...}>` with FormData."

---

## What AI got wrong (and how I caught it)

| # | What it did | Why it was wrong | How I caught it | Fix |
|---|-------------|------------------|-----------------|-----|
| 1 | First draft of `lib/supabase/server.ts` did not wrap `cookieStore.set` in a try/catch | In RSC context, `setAll` throws — would have produced runtime errors on every page load | Read-every-line review against the official `@supabase/ssr` Next.js 14 doc | Wrapped in try/catch with a comment explaining the RSC vs middleware split |
| 2 | First draft of `createUpdate` only inserted into `startup_updates` and forgot to mirror `risk_level` to the parent `startups` row | `updated_at` would never bump → dashboard ordering wrong; `risk_level` on cards would drift from latest update | Dashboard ordering smoke test — clicked a startup, added a "red" update, went back to dashboard, card still showed green | Added the secondary `UPDATE startups SET risk_level, updated_at WHERE id = ...` after the insert |
| 3 | Generated RLS policy: `create policy "anon_read" ... using (true)` for the `startups` table | Would have allowed anonymous traffic to SELECT every startup — security hole. The anon key is `NEXT_PUBLIC_*` and shipped to the browser | Read every line of the migration file; flagged `using (true)` immediately | Tightened to `auth.role() = 'authenticated'` |
| 4 | Used `any` for the joined Supabase response shape (`profiles:responsible_id(...)` returns a relational object) | Lost type safety on the join's nullable shape; would silently accept missing fields | TypeScript strict mode flagged on save (`noUncheckedIndexedAccess`) | Cast through a narrow interface `{ full_name: string \| null } \| null` and asserted via a type narrowing |

> **Pattern across all four:** AI's defaults are *correct enough that they look right at a glance*. The cost of skipping line-by-line review is paying for these in production. The cost of doing it is ~30 seconds per file. There is no version of the math where skipping wins.

---

## What I'd do differently next time

- **Generate the migration BEFORE generating the Server Actions.** When I generated actions first, AI hallucinated column names that I then had to back-port to the migration. Schema → types → actions → UI is the right order.
- **Pin the Supabase JS client version on day one.** `@supabase/ssr` had a minor breaking change between recent versions; not pinning costs ~10 minutes the first time you hit it.
- **Write the README hero last, but write its skeleton first.** Knowing what the live URL needs to fit on the first screen drives a sharper PRD.

---

## Trade-offs I accepted (with reasons)

| Trade-off | Why I accepted it | What's the risk |
|---|---|---|
| **No formal test suite** | 6h budget; tests would have eaten the docs and the deploy | Regression risk on changes. Mitigated by TS strict + Zod + manual smoke. Documented in `TODO.md`. |
| **Single role (no admin/viewer)** | Cuts 30 min of policy work and a UI permission layer | Real-world deployments need this. Migration path: add `role` column to `profiles` + tighten policies. ~1h of work. |
| **Append-only updates** | Cuts edit/delete CRUD UI; matches "immutable history" intuition | Mistyped updates linger. Acceptable for MVP; edit-with-history is a v0.2. |
| **`useTransition` instead of a form library** | Zero deps; works without JS via the form action; tiny client surface | Less flexible than `react-hook-form`; sufficient for two forms. |
| **No real-time** | RSC + `revalidatePath` is enough; WebSocket would have added an Express-style server | Multi-user concurrent editing is a v0.2 problem. |

---

## Reusable artifacts from this build

- **Code-review skill** at [`.claude/skills/code-review.md`](../.claude/skills/code-review.md) — drop-in Claude Code skill for AI-assisted review with severity ratings + OWASP mapping. Generic, project-agnostic.
- **The SDD chain** (BRAINSTORM → DEFINE → DESIGN) lives in `.claude/sdd/features/` of the parent submission. Reusable as a template for any AI-assisted MVP build.

---

## What this document is not

It is not a victory lap. AI did real work here, *and* AI made real mistakes here. The discipline is in catching them. That is the entire job, and it is the entire reason this document exists.
