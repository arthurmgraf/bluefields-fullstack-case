# Execution Plan & Retrospective

> The build plan and the post-mortem in one place.

---

## Plan (set at hour 0)

| Hour | Block | Output | Hard cutoff |
|------|-------|--------|-------------|
| 0:00 – 0:45 | Setup + PRD + Schema | Project init, Supabase configured, schema migrated, PRD v1 | 0:45 |
| 0:45 – 1:45 | Auth + Server Actions | Magic-link login, middleware gate, all 3 actions with Zod | 1:45 |
| 1:45 – 3:30 | UI — 3 pages | `/login`, `/` dashboard, `/startups/[id]` detail with inline form | 3:30 |
| 3:30 – 4:15 | Polish + Seed + Deploy | 8 seeded startups, deployed to Vercel, smoke tests pass on prod | 4:15 |
| 4:15 – 5:30 | Docs + Skill | README, AI_USAGE, ARCHITECTURE, TODO, code-review skill | 5:30 |
| 5:30 – 6:00 | Buffer | Final walkthrough, screenshots for README, submission email | 6:00 |

**Rule:** if a block runs over by >15min, ship what works and skip ahead. No rabbit holes.

---

## Failure-mode contingencies (set in advance)

| At hour | If incomplete, drop... | Don't drop... |
|---------|------------------------|----------------|
| 1:45 (auth not done) | Magic link → use hardcoded demo password in seed | DB schema, deploy step |
| 3:30 (UI behind) | `/startups/[id]` detail page → put updates in modal on dashboard | Dashboard page itself |
| 4:15 (deploy issues) | Vercel CLI direct push, skip Vercel Git connect | A working URL of any kind |
| 5:30 (docs behind) | Trim AI_USAGE to 80 lines, skip ARCHITECTURE | README, skill, AI_USAGE |

### Hard rules
- **Never skip the deploy step.** A working Vercel URL beats a perfect localhost.
- **Never skip AI_USAGE.md.** It is the highest-signal doc.
- **Never skip line-by-line review.** That is the entire premise.

---

## Actuals (filled during the build)

| Block | Estimated | Actual | Variance | Notes |
|-------|-----------|--------|----------|-------|
| 0:00–0:45 Setup + PRD + Schema | 45min | _TBD_ | | |
| 0:45–1:45 Auth + Actions | 60min | _TBD_ | | |
| 1:45–3:30 UI | 105min | _TBD_ | | |
| 3:30–4:15 Polish + Deploy | 45min | _TBD_ | | |
| 4:15–5:30 Docs + Skill | 75min | _TBD_ | | |
| 5:30–6:00 Buffer | 30min | _TBD_ | | |

> Update this table at the end of the build with the real numbers. Honesty here is more valuable than hitting the estimates.

---

## Retrospective (filled at end)

### What went well
- _to fill_

### What I'd change
- _to fill_

### What I learned
- _to fill_

---

## Reusable patterns extracted from this build

The patterns below are not specific to this product — they're how I'd build *any* AI-augmented MVP next time.

1. **Schema → types → actions → UI.** Always in that order. Generating UI before the schema is fixed produces shape-mismatch refactors.
2. **Zod schemas live in one file.** Importable from any Server Action; type inferred via `z.infer<>`. Single source of truth.
3. **`@supabase/ssr` has three contexts.** Server (RSC + actions), browser, middleware. Don't mix them. The middleware variant exists specifically because cookies behave differently in middleware vs RSC.
4. **Discriminated-union return types from Server Actions.** `{ ok: true, data? } | { ok: false, error, fieldErrors? }`. Easier for the UI than try/catch around `await action(...)`.
5. **`'use client'` is a cost.** Default to RSC; flip to client only when you need an event handler or browser-only state.
6. **`revalidatePath` after every mutation.** This is the cache-invalidation discipline. Forget it once and the bug is a debugging hour.
7. **AI's defaults are *almost* right.** Build the line-by-line read into the workflow, not as a separate "review step". Otherwise it gets cut.
