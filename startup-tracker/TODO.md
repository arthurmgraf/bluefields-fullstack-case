# TODO — Honest Debt

> Things deferred from the MVP, with explicit reasons. Reviewing this list is part of the brief.

---

## Quality

- [ ] **Formal test suite (Vitest + Testing Library).** Time-boxed at 6h; tests would have eaten the deploy and the docs. TS strict + Zod + manual smoke is the chosen substitute. ETA to add: ~2h.
- [ ] **E2E test for the auth flow (Playwright).** Magic-link delivery is the most failure-prone path; it deserves an automated test. ETA: ~1h once tests exist.
- [ ] **Per-component snapshot tests for `risk-badge`, `startup-card`, `summary-stats`.** Pure presentational; easy wins.

---

## Features

- [ ] **Filters and search on dashboard.** Cut to save 30 min. Reasonable triggers: 20+ startups in the portfolio.
- [ ] **Inline edit of risk_level on dashboard cards.** Currently risk only changes via a new update; sometimes you just want to override.
- [ ] **Risk history sparkline on detail page.** Show the trajectory of risk over time, not just the latest value.
- [ ] **Markdown rendering for `content` / `blockers` / `next_steps`.** Currently plain text; lists and code blocks would help.
- [ ] **Edit / delete updates.** Currently append-only by design. Real-world use needs at least typo correction.
- [ ] **Admin / viewer role split.** All authenticated users can do everything. Migration: `role` column on `profiles` + tightened RLS policies.
- [ ] **Email digest of risk changes.** Weekly summary of which startups changed risk level, sent via Supabase Edge Function + Resend.
- [ ] **Soft delete for startups.** Currently CASCADE deletes everything; sometimes you want to archive.

---

## Operations

- [ ] **Pre-commit hook for `tsc --noEmit` and `eslint`.** Would have caught the `any` slip in `startups.ts` before the commit.
- [ ] **CI pipeline (GitHub Actions).** Currently nothing runs in CI. Recommended: install → typecheck → lint → preview deploy.
- [ ] **OpenTelemetry tracing.** Currently `console.error` only. Would help with magic-link delivery debugging.
- [ ] **Rate limiting on Server Actions.** Magic-link is unauth and could be abused. `@upstash/ratelimit` or Vercel's edge config.
- [ ] **Backup strategy for Supabase.** Free tier doesn't auto-backup. Production should pin to a paid tier or schedule pg_dump.

---

## Security

- [ ] **Audit log on `startup_updates`.** Currently who-wrote-what is implicit (`author_id` on the update). An immutable audit table covering all writes (including startups CRUD) would tighten the security story.
- [ ] **CSP headers via `next.config.ts`.** Default Vercel headers are reasonable but not exhaustive.
- [ ] **Honeycomb / Sentry for error visibility.** `console.error` to Vercel logs is fine for MVP, not for a production where someone is paged.

---

## Performance (only if real-world usage justifies it)

- [ ] **Pagination on the dashboard.** Currently loads all startups. Fine until ~200; needs `limit + offset` + virtual scroll past that.
- [ ] **Indexed full-text search on `startup_updates.content`** — when search lands.
- [ ] **Materialized view for the summary-stats counts** — when the dashboard is hit by 100+ users/day.

---

## What I would NOT add even with more time

These cuts were intentional and I think the right call:

- ~~Custom design system~~ — Shadcn/UI is enough; design is not the differentiator.
- ~~Dark mode~~ — `--background` / `--foreground` CSS vars are wired, but the theme toggle isn't. One-screen app, low ROI.
- ~~Offline support~~ — internal B2B tool; assume a network.
- ~~AI features inside the product~~ — explicit case constraint ("IA é no processo, não no produto").
