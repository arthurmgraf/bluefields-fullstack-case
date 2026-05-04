# DEFINE: Bluefields Startup Tracker

> An internal portfolio-tracking MVP that gives the Bluefields acceleration team a single, always-current view of every startup's progress, risk level, and next steps — built end-to-end in under 6 hours as the case-study deliverable for the Bluefields Fullstack Developer (AI-First) hiring process.

---

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | BLUEFIELDS_TRACKER |
| **Date** | 2026-05-04 |
| **Author** | arthurmgraf (via define-agent) |
| **Status** | Ready for Design (or skip to execution per BRAINSTORM §13) |
| **Clarity Score** | 14/15 |
| **Source** | `BRAINSTORM_BLUEFIELDS_TRACKER.md` (v2) |
| **Sibling Asset** | `codemap-tool/` — featured in submission as Layer 3 portfolio proof |

---

## Problem Statement

Bluefields has accelerated 300+ startups in 8 years; today the team tracks them across WhatsApp, email, Notion, Google Drive, and tribal knowledge. The result: 4–6 hours/day lost to information hunting, startups in trouble are noticed days late, and there is no data-backed way to prioritize attention. The MVP collapses that fragmentation into a single authenticated web app where any team member can see — at a glance — the status, risk level, and most recent activity for every startup in the portfolio.

A second, equally important problem this case answers: **demonstrate that the candidate can take a vague brief, ship a working AI-augmented fullstack product fast, and document the process credibly enough to pass technical and cultural evaluation.**

---

## Target Users

| User | Role | Pain Point |
|------|------|------------|
| **Acceleration Manager** | Bluefields portfolio lead | Has to message 5 people to know if Startup X is on track this week |
| **Acceleration Analyst** | Day-to-day startup contact | Captures updates verbally but has no canonical place to store them, so context evaporates between handoffs |
| **(Implicit) Hiring evaluator** | Bluefields engineering | Needs to see PRD → AI workflow → live URL → reusable skill in one cohesive submission |

> MVP collapses both internal personas into a single authenticated user (admin/viewer split deferred — see Out of Scope).

---

## Goals

| Priority | Goal |
|----------|------|
| **MUST** | Authenticated single-page-app where any team member sees every startup with a live risk indicator (🟢🟡🔴) |
| **MUST** | Capture periodic updates per startup (`content`, `blockers`, `next_steps`, `risk_level` snapshot) and surface them as a chronological timeline |
| **MUST** | Persist data in Postgres with Row-Level Security enforcing authenticated-only read/write |
| **MUST** | Deploy to a public Vercel URL accessible to evaluators |
| **MUST** | Ship the 5 case deliverables: PRD, EXECUTION_PLAN, MVP, AI_USAGE doc, reusable Claude Code skill |
| **MUST** | AI_USAGE.md documents ≥4 specific things AI got wrong + how the developer caught them |
| **MUST** | README hero links to `codemap-tool` repo as Layer 3 portfolio proof |
| **SHOULD** | 6–8 seeded Brazilian startups (no Lorem Ipsum) so the demo screenshots feel real |
| **SHOULD** | Pre-rehearsed interview talking points captured in BRAINSTORM §10 |
| **COULD** | Inline edit of risk_level on dashboard cards (cut from MVP, listed in TODO.md) |
| **COULD** | Sticky session for magic-link bypass during demo |

---

## Success Criteria

Measurable, verifiable outcomes:

- [ ] Public Vercel URL returns 200 and loads in <2s (p95) on a cold visit
- [ ] Golden path completes in <2 minutes on first use: login → dashboard → click startup → submit new update → see it in timeline
- [ ] Database has ≥6 seeded startups with realistic Brazilian names and ≥1 update each
- [ ] Repo contains 5 deliverables in expected paths: `docs/PRD.md`, `docs/EXECUTION_PLAN.md`, live URL in README, `docs/AI_USAGE.md`, `.claude/skills/code-review.md`
- [ ] Zero `any` types in `src/actions/`, `src/lib/`, `src/components/` (verified via `tsc --strict`)
- [ ] All Supabase tables have RLS enabled and at least one policy each
- [ ] No secrets committed (`.env` in `.gitignore`, only `.env.example` in repo)
- [ ] AI_USAGE.md contains ≥4 specific "what AI got wrong" entries with caught-by attribution
- [ ] README opening 30 seconds plant all three layers: live URL, AI_USAGE pointer, codemap reference
- [ ] Build wall-clock time ≤6h (logged honestly in EXECUTION_PLAN.md)

---

## Acceptance Tests

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AT-001 | Magic-link login happy path | Unauthenticated user | Submits valid email on `/login` | Magic link arrives in inbox; clicking it lands on `/` (dashboard) with session cookie set |
| AT-002 | Dashboard renders portfolio | Authenticated user with ≥6 seeded startups | Visits `/` | Sees grid of startup cards, each with name, segment, phase, responsible, risk badge, "last update X days ago"; summary count chip shows totals by risk |
| AT-003 | Startup detail loads updates | Authenticated user | Clicks any startup card | Routes to `/startups/[id]`; shows startup metadata + chronological updates timeline (newest first) |
| AT-004 | Create update via inline form | On startup detail page | Submits form with content + risk_level | Update appears at top of timeline immediately; data persists across reload; startup `risk_level` reflects newest update |
| AT-005 | RLS blocks anonymous access | Unauthenticated user | Hits any `/startups/*` URL or invokes a server action | Redirected to `/login`; raw Supabase query from anon key returns empty/403 |
| AT-006 | Zod rejects invalid input | Authenticated user | Submits form with `risk_level = 'purple'` or empty `content` | Server action returns validation error; UI shows the message; no DB write occurs |
| AT-007 | Risk badge color contract | Any startup card | Renders | `risk_level='green'` → green badge, `'yellow'` → yellow, `'red'` → red; visual matches WCAG AA contrast |
| AT-008 | Server-side data fetching | Dashboard request | Page renders | HTML response already contains startup data (no client-side fetch flicker); confirms RSC pattern |
| AT-009 | Logout invalidates session | Authenticated user | Clicks logout | Session cookie cleared; navigating to `/` redirects to `/login` |
| AT-010 | Submission completeness | Evaluator | Opens repo and reads first 30s of README | Sees live Vercel URL, screenshot, link to AI_USAGE.md, link to codemap-tool |

---

## Out of Scope

Explicitly NOT in this MVP — confirm at submission, do not silently scope-creep:

- ❌ **Filters and search on dashboard** — single grid view only (deferred to TODO.md)
- ❌ **Risk history visualization** — only current `risk_level` shown, no timeline chart
- ❌ **Role-based access (admin/viewer split)** — single role for all authenticated users
- ❌ **Markdown rendering in updates** — plain `<textarea>` and `<pre>` display
- ❌ **Edit/delete updates** — append-only timeline (immutable history)
- ❌ **Formal automated test suite** — TypeScript strict + Zod + manual smoke is the chosen guardrail; tests listed as honest debt in TODO.md
- ❌ **Pixel-perfect UI / custom design system** — Shadcn/UI defaults only
- ❌ **Mobile-optimized responsive design** — desktop-first; mobile is "works but not pretty"
- ❌ **Multi-tenancy / multiple Bluefields workspaces** — single org assumed
- ❌ **WhatsApp / Slack / email integrations** — explicitly excluded by the case brief
- ❌ **AI features inside the product** — "IA é no processo, não no produto" (explicit case constraint)
- ❌ **Real-time updates (WebSocket/SSE)** — `revalidatePath` after mutation is sufficient
- ❌ **File uploads / pitch deck attachments** — text-only updates
- ❌ **Notifications / email digests** — out of scope per case brief
- ❌ **Audit log / change history** — not asked
- ❌ **Internationalization** — Portuguese-Brazilian UI only

---

## Constraints

| Type | Constraint | Impact |
|------|------------|--------|
| **Timeline** | Hard 6-hour wall-clock budget | Forces aggressive YAGNI; failure-mode table in BRAINSTORM §9 governs cuts; deploy step is non-negotiable even if features fall |
| **Technical (stack)** | Next.js 14 (App Router) + Supabase + Vercel + TypeScript + Tailwind + Shadcn/UI + Zod | Fixed by BRAINSTORM v2; chosen for fastest path-to-deploy and explicit alignment with Bluefields' stack examples |
| **Technical (auth)** | Magic link only (no email/password, no OAuth) | Saves register flow ~30min; risk: requires functional SMTP in Supabase free tier; mitigation: hardcoded demo user fallback documented in BRAINSTORM §9 |
| **Technical (data)** | Postgres via Supabase with RLS enabled on every table | Forces security-first schema design; surfaces in ARCHITECTURE.md as a documented decision |
| **Resource** | Solo build, no design system, no QA | Quality bar is "shipped + readable", not "production-grade"; trade-offs documented in AI_USAGE.md |
| **Resource (cost)** | Free tier only (Vercel hobby + Supabase free) | No paid services; sufficient for demo loads (<100 visits) |
| **Process** | All code is AI-generated then human-reviewed | Per case brief: "você será responsável por todo código gerado, mesmo se for um código do seu agente de IA" — every commit must pass a manual line-by-line review |
| **Documentation** | 5 deliverables required: PRD, EXECUTION_PLAN, MVP, AI_USAGE, reusable skill | Non-negotiable; missing any one is a fail signal |

---

## Technical Context

| Aspect | Value | Notes |
|--------|-------|-------|
| **Deployment Location** | New Next.js app at `case_fullstack_developer/bluefields-tracker/` (sibling to `codemap-tool/`) | Keeps the case self-contained; codemap-tool stays referenced but separated |
| **Repo Strategy** | New public GitHub repo (e.g., `arthurmgraf/bluefields-case`) — submitted to evaluator | Clean commit history; no clutter from this monorepo's other projects |
| **KB Domains** | None internal. External references: Next.js 14 App Router, Supabase JS client + SSR helpers, Shadcn/UI install guide. Use `mcp__context7__query-docs` for live syntax. | KB-driven design phase not applicable; case is self-contained |
| **IaC Impact** | None — Vercel and Supabase are managed; provisioned via web UI in <5 minutes | No Terraform; document setup steps in README |
| **External Services** | Supabase (auth + DB + RLS), Vercel (host), GitHub (source + PR review demo) | All free tier; no API keys with cost exposure |
| **AI Toolchain (process)** | Claude Code (Opus 4.7) primary; `codemap-tool` running locally to capture activity logs that feed AI_USAGE.md "what AI got wrong" table | This is itself a process artifact worth mentioning in the AI_USAGE doc |

---

## Assumptions

| ID | Assumption | If Wrong, Impact | Validated? |
|----|------------|------------------|------------|
| A-001 | Supabase free tier supports the schema and load (3 tables, ~10 rows, ≤10 demo users) | Migrate to Neon/Railway → +30min | [x] Quotas: 500MB DB, 50K MAU — way over needs |
| A-002 | Vercel hobby tier covers the demo (no commercial use, <100GB bandwidth) | Migrate to Render → +30min | [x] Hobby: 100GB bandwidth/mo |
| A-003 | Supabase magic-link email delivery completes in <30 seconds | If slow, demo UX degrades — fall back to hardcoded test user (BRAINSTORM §9) | [ ] Will validate during hour 0:45–1:45 |
| A-004 | Evaluator opens README first and follows links downward (URL → AI_USAGE → codemap) | If they jump to code first, the codemap leverage is weakened | [ ] Mitigation: README hero is unmissable |
| A-005 | Hiring evaluator has Bluefields Brazilian-Portuguese context but is comfortable with English in code/docs | Translate UI strings only, keep code/docs in English | [x] Industry standard |
| A-006 | The "5 deliverables" are interpreted as required artifacts, not optional | If only some are required, no harm done; if all required, we're covered | [x] Re-read of case brief — all 5 listed explicitly |
| A-007 | The `codemap-tool` reference will be perceived as relevant signal (not bragging) | If perceived as bragging, mitigate via tone: "I built this because I needed it for myself" | [x] Tone-tested in BRAINSTORM §10 talking points |
| A-008 | <6h is achievable for this scope with AI assistance | If overrun, ship at hour 6 with whatever works (failure-mode table) | [ ] Will know at hour 3:30 checkpoint |

---

## Clarity Score Breakdown

| Element | Score (0-3) | Notes |
|---------|-------------|-------|
| **Problem** | 3 | Two-layered problem (Bluefields' fragmentation + the candidate's hiring case) is explicit and quantified (4-6h/day, 300+ startups, 8 years) |
| **Users** | 2 | One internal persona for MVP + implicit evaluator persona. Admin/viewer split deferred. -1 because role differentiation is conceptually present in the case but cut from MVP, leaving a small ambiguity |
| **Goals** | 3 | MoSCoW prioritized; MUST list is exhaustive; SHOULD/COULD lists are honest |
| **Success** | 3 | All 10 criteria are measurable / checkable / time-bound |
| **Scope** | 3 | 14 explicit out-of-scope items with rationale per item |
| **Total** | **14/15** | ✅ Above 12/15 threshold — proceed |

**Why not 15:** Users score has the role-differentiation ambiguity. Not worth resolving now — it's documented as deferred and the MVP is fine with single role.

---

## Open Questions

None blocking. The two unvalidated assumptions (A-003 magic link latency, A-008 6h feasibility) are addressed by the failure-mode table in `BRAINSTORM_BLUEFIELDS_TRACKER.md` §9. They will resolve themselves during execution rather than upfront.

One soft question for the candidate's own reflection: **what is the single sentence in the submission email that earns the 30-second read?** Suggestion: *"Live URL: <vercel>. The README's first 30 seconds plant my AI workflow doc and the codemap-tool I built to visualize Claude Code agents — that's the toolchain I use, including for this case."*

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-04 | define-agent | Initial extraction from BRAINSTORM v2 — 14/15 clarity, all sections populated, no blocking questions |

---

## Next Step

Two valid paths from here:

| Path | When | Command |
|------|------|---------|
| **Skip to execution** (Recommended given <6h budget) | Treat this DEFINE + the BRAINSTORM as the spec; open Claude Code in a fresh repo and start hour 0 | (Manual) — `npx create-next-app@latest`, follow §5 Timeline |
| **Continue full SDD** | If you want a file-by-file architecture doc + parallel work-group decomposition | `/design DEFINE_BLUEFIELDS_TRACKER.md` |

The DEFINE is now self-contained — an evaluator could read it cold and understand exactly what "shipped" means.

---

> **Closing note for execution.** When you start hour 0, the first thing to do is *not* `npx create-next-app`. The first thing is open this DEFINE file in a split pane next to your Claude Code session and use AT-001 through AT-010 as the smoke-test checklist. Drive to green from the bottom up.
