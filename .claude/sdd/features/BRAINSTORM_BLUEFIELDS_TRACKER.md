# 🔵 Bluefields Case — Strategic Brainstorm v2

> Successor to `first_brainstorm.md`. Compressed for **<6h execution**, **codemap-tool leveraged as AI-First proof**, ruthless YAGNI applied.

---

## ⚡ TL;DR

| Dimension | Decision |
|---|---|
| **Time budget** | < 6h (was 8h) |
| **Stack** | Next.js 14 (App Router) + Supabase + Vercel |
| **Auth** | Magic link (no register flow) |
| **Codemap angle** | Featured throughout (README hero, AI_USAGE case study, ARCHITECTURE refs) |
| **Cut scope** | Filters, history viz, role-based access, formal test suite, markdown editor |
| **Win condition** | Shipped MVP + AI workflow narrative that proves AI-First at *staff* level |

The single biggest lever you have over other candidates: **you already shipped a fullstack TypeScript+React+Express+WebSocket project (`codemap-tool`) whose entire purpose is visualizing Claude Code agents.** That is not a side project — that is the *exact thesis* of this job. The brainstorm v2 makes sure the evaluator sees it.

---

## 0. 🎯 STRATEGIC POSITIONING — Read This First

### The asset you already have

`codemap-tool` (in this repo, sibling to the case) is a fullstack pixel-art visualization of Claude Code & Cursor agents:

- **Stack:** TypeScript, React 18, Vite, Express, WebSocket, Canvas, Bash hooks
- **Surface:** 248 automated tests, npm workspaces, Dockerized, MIT-licensed
- **Thesis:** observability for AI coding agents — literally the vibe coding workflow Bluefields asks about

Re-read this from the job posting:

> *"Conversa sobre como você estrutura seu ambiente e toolchain AI-augmented: editores, modelos, prompts, estratégias para reduzir bugs e débito técnico."*

> *"Desafio prático curto: implementar uma pequena feature fullstack usando IA no fluxo (podendo mostrar o **próprio vibe coding workflow**)."*

You don't just *talk* about your AI workflow — you *built a tool to visualize it*. That is a pre-built answer to interview question #2. **Most candidates won't have this.** Make sure the evaluator stumbles into it within 30 seconds of opening your README.

### The 3-layer narrative

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — Functional Proof (the Bluefields tracker MVP)             │
│  ✓ Ships a working app on Vercel, end-to-end, in < 6h                │
│  ✓ Demonstrates: PRD → spec → AI gen → review → ship                 │
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 2 — Reflective Proof (AI_USAGE.md + decision logs)            │
│  ✓ Shows what AI got wrong, what you caught, why                     │
│  ✓ Quantifies: prompts written, files generated, lines reviewed      │
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Portfolio Proof (codemap-tool reference)                  │
│  ✓ "I've been thinking about AI observability deeply enough to       │
│     ship a tool for it" — preempts the toolchain interview question  │
└──────────────────────────────────────────────────────────────────────┘
```

Most candidates deliver only Layer 1. Stronger ones add Layer 2. **You hit all three.**

---

## 1. 📋 Job Posting Decoded — What They *Actually* Want

| What the post says | What they're testing | Where you prove it |
|---|---|---|
| "AI-First mindset" | Do you reach for AI by default and treat it as a peer? | Layer 2 (AI_USAGE.md) + Layer 3 (codemap) |
| "Da ideação ao deploy" | Can you ship without supervision? | Layer 1 (live Vercel URL) |
| "Guardrails de IA" | Can you constrain AI from producing junk? | Layer 1 (Zod + TypeScript), Skill deliverable |
| "Equilibrar velocidade com débito técnico" | Do you know when to hack and when to refactor? | TODOs section in README, AI_USAGE explicit trade-offs |
| "Critério técnico" | Architecture, security, types, error handling | Layer 1 code quality + ARCHITECTURE.md |
| "Documentação pragmática" | Can you write for humans, not just yourself? | All 4 docs files concise + scannable |
| **(Implicit) Cultural fit** | "Generosidade, respeito" — collaborative tone | Decision logs framed as *trade-offs*, not *certainties* |

**What they are NOT testing** (don't waste time on these):
- Pixel-perfect UI design
- 90%+ test coverage
- Comprehensive feature parity with real tools (Notion, Linear)
- Custom design system
- Multi-tenancy / scale concerns

---

## 2. 🧩 Scope — Compressed via YAGNI

### Decision matrix

| # | Feature | v1 plan | v2 plan | Reason |
|---|---|---|---|---|
| 1 | Cadastro de startups | ✅ | ✅ | Core requirement |
| 2 | Updates por startup (CRUD) | ✅ | ✅ create+read | Cut update/delete UI to save 30min |
| 3 | Indicador de risco 🟢🟡🔴 | ✅ | ✅ | Core requirement |
| 4 | Dashboard consolidado | ✅ | ✅ | Core requirement |
| 5 | Auth | Email+pass | **Magic link** | Saves register flow (~30min) |
| 6 | Persistência | Supabase | Supabase | ✅ |
| 7 | Deploy | Vercel | Vercel | ✅ |
| ❌ | Filtros + busca | ✅ | **CUT** | -30min, low signal |
| ❌ | Histórico visual de risco | ✅ | **CUT** | -45min, nice but not asked |
| ❌ | Role-based access | ✅ | **CUT** | -30min, single role for MVP |
| ❌ | Markdown nos updates | ✅ | **CUT** | -20min, plain `<textarea>` |
| ❌ | Formal test suite | ✅ | **CUT → TODO** | -1h, document as honest debt |
| ✅ | Seed data realista (BR) | ✅ | ✅ | Critical for demo screenshot |

### What survives = the **answer to the case**

The case asks for: *"visão clara e atualizada do progresso, riscos e próximos passos de cada startup."*  Everything cut is decoration; everything kept is core.

---

## 3. ⚙️ Stack — Trimmed Justification

```
Frontend  → Next.js 14 (App Router) + React Server Components + Tailwind + Shadcn/UI
Backend   → Next.js Server Actions + Zod validation
Data/Auth → Supabase (Postgres + Auth + RLS)
Deploy    → Vercel (zero-config, Git-driven)
```

### Why NOT match codemap's stack (React+Express+Vite)?

Considered. Rejected because:

- Vercel + Next.js = **15-min deploy** vs ~1h for separate Express + frontend
- Server Actions remove API boilerplate (you're not paid for boilerplate)
- Bluefields' post lists Next.js explicitly as a stack example
- **Showing range > showing consistency** — codemap proves you do React+Express; the case proves you also do Next.js

### Why Supabase over Prisma+Postgres?

- Auth + DB + RLS in one SDK (~30min to wire) vs ~1.5h for Prisma+NextAuth+Postgres
- RLS is a real security primitive worth documenting in ARCHITECTURE.md
- Free tier covers a demo

---

## 4. 📐 Schema — Locked from v1

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  segment TEXT NOT NULL,
  phase TEXT NOT NULL,
  risk_level TEXT DEFAULT 'green' CHECK (risk_level IN ('green','yellow','red')),
  responsible_id UUID REFERENCES profiles(id),
  description TEXT,
  founded_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE startup_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  blockers TEXT,
  next_steps TEXT,
  risk_level TEXT DEFAULT 'green' CHECK (risk_level IN ('green','yellow','red')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: any authenticated user can read all + write their own
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read" ON startups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON startups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read" ON startup_updates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON startup_updates FOR INSERT WITH CHECK (auth.uid() = author_id);
```

**Trade-off documented:** "I'd add admin/viewer split via a `role` column + policy refinement post-MVP."

---

## 5. ⏱️ Timeline — Hour-by-Hour for 5.5h

| Hour | Block | Output | Hard cutoff |
|---|---|---|---|
| **0:00 – 0:45** | Setup + PRD + Schema | `package.json` configured, Supabase project live, schema migrated, `docs/PRD.md` v1 (300 LOC max) | 0:45 |
| **0:45 – 1:45** | Auth + Server Actions | Magic-link login, middleware protecting routes, `actions/startups.ts` + `actions/updates.ts` with Zod | 1:45 |
| **1:45 – 3:30** | UI — 3 pages | `/login`, `/` dashboard (grid + risk badges), `/startups/[id]` (detail + new-update inline form) | 3:30 |
| **3:30 – 4:15** | Polish + Seed + Deploy | 6-8 realistic seeded startups, deploy to Vercel, smoke test golden path on prod URL | 4:15 |
| **4:15 – 5:30** | Docs + Skill | README, AI_USAGE.md, ARCHITECTURE.md, `.claude/skills/code-review.md` | 5:30 |
| **5:30 – 6:00** | Buffer | Final walkthrough, screenshot for README, submission email | 6:00 |

> **Rule:** if a block runs over by >15min, ship what works and skip ahead. No rabbit holes.

---

## 6. 🚀 The 5 Deliverables — Concrete Templates

The case asks for **5 specific artifacts**. Each below has a target shape.

### Deliverable 1: PRD enxuto → `docs/PRD.md`
- ~250 lines max
- Sections: Problem · Personas · User stories (MoSCoW) · Functional/Non-functional reqs · Schema · Acceptance criteria · In/Out of scope
- **Tone:** confident, not exhaustive. "We chose X because Y" not "We considered A, B, C, D, E"

### Deliverable 2: Plano de execução → `docs/EXECUTION_PLAN.md`
- ~150 lines
- This *brainstorm v2* itself becomes the seed
- Add: actual hours spent vs estimated, decisions deferred to v2

### Deliverable 3: MVP fullstack → live Vercel URL + repo
- README starts with the URL — first thing they see
- Demo credentials for magic-link bypass: pre-seeded test user

### Deliverable 4: AI Usage doc → `docs/AI_USAGE.md` ⭐ **THE BIG ONE**
- See section 7 for full structure

### Deliverable 5: Skill → `.claude/skills/code-review.md`
- Drop-in Claude Code skill (works in any project)
- See section 8 for structure

---

## 7. 🤖 AI Workflow Narrative — The Document That Wins

### `docs/AI_USAGE.md` — proposed structure

```markdown
# How I Used AI in This Case

## TL;DR
Built in <6h with Claude Code as primary pair. ~85% of code AI-generated,
100% reviewed. Caught 4 issues across the build (listed below).

## My AI Toolchain
- **Primary editor:** Claude Code (Opus 4.7)
- **Fallback:** Cursor for quick local refactors
- **Observability:** I built [`codemap-tool`](https://github.com/JamsusMaximus/codemap)
  to *visualize* my AI agents in real-time. It captures every Read/Write/Bash
  call via shell hooks — gives me an audit trail and a tool-use heatmap.
  This case was built with codemap running in the background.
  ![codemap screenshot](./codemap-demo.gif)

## The Loop I Followed (per feature)
1. Write spec in plain language (3-10 lines)
2. Pass spec to Claude with explicit constraints (Next.js 14, Server Actions,
   Zod, Supabase RLS)
3. Generate
4. Read EVERY line (this is the part most people skip)
5. Run + iterate

## Specific Prompts Used (verbatim)
[3-5 actual prompts, raw, with the response summary]

## What AI Got Wrong (and how I caught it)
| # | What it did | Why it was wrong | How I caught it | Fix |
|---|---|---|---|---|
| 1 | Used `useEffect` to fetch in RSC page | Should be server-side fetch | Type error (async client component) | Removed `'use client'`, awaited in component body |
| 2 | Forgot `revalidatePath` after mutation | Stale UI after create | Manual smoke test | Added to action |
| 3 | Generated RLS policy that allowed anon SELECT | Security hole | Read every line of migration | Tightened to `auth.role() = 'authenticated'` |
| 4 | Used `any` for Supabase response | Lost type safety | TS strict mode flagged on save | Generated types via `supabase gen types typescript` |

## Trade-offs I Accepted
- **No formal tests** — Time-boxed at 6h. Zod + TS strict + manual smoke
  was the chosen guardrail. Documented in `TODO.md`.
- **Single role** — admin/viewer cut. RLS policy noted in ARCHITECTURE.md.
- **No filters** — backlog. The 6-card grid is enough at 6 startups.

## What I'd Do With Another Day
[Honest list. Shows judgement.]
```

**Why this structure wins:**
- Quantifies AI usage (numbers > vibes)
- Lists 4 specific catches → proves you're not rubber-stamping
- Codemap reference is *organic*, not bolted-on
- Trade-offs are explicit → matches "saber quando aceitar um hack"
- Last section shows you have *more* in the tank

---

## 8. 🛡️ Code Review Skill — The 5th Deliverable

### Format: Claude Code skill (`.claude/skills/code-review.md`)

A drop-in skill any project can install. ~150 LOC. Structure:

```markdown
---
name: code-review
description: Structured AI-assisted code review with severity ratings,
  OWASP Top 10 checklist, and Next.js / TypeScript-specific patterns.
  Modeled on observability patterns from codemap-tool's hook system.
---

# Code Review Skill

## When to Invoke
Run before merging any PR or after Claude generates >50 LOC.

## Checklist (auto-iterates)
### Security (OWASP)
- [ ] SQL injection — using parameterized queries / ORM, not string concat
- [ ] XSS — no `dangerouslySetInnerHTML` without sanitization
- [ ] Auth — every server action validates session
- [ ] RLS — every Supabase table has policies
- [ ] Secrets — no `.env` values hardcoded
- [ ] CORS — locked to known origins

### Type safety
- [ ] No `any` without justification comment
- [ ] Zod schemas at every external boundary
- [ ] Discriminated unions used for state machines

### Performance
- [ ] No N+1 queries (Supabase joins, not loops)
- [ ] Server Components by default; `'use client'` only when needed
- [ ] Images via `next/image`

### Observability (inspired by codemap-tool)
- [ ] Server actions log entry/exit with timing
- [ ] Errors propagate with context, not just messages
- [ ] User-facing errors are sanitized

## Prompt Template
"Review the diff in `<files>` against the checklist above.
Return findings as a markdown table:
| Severity | File:Line | Finding | Suggested fix |
Severity scale: CRITICAL / HIGH / MEDIUM / LOW.
Group by severity. Cite OWASP code where applicable."

## Output Format
[Example output for the user]
```

**Why a skill (not a CLI/Action)?**
- 30min to ship vs 2-3h
- Demonstrates Claude Code fluency (the literal product)
- Reusable — actually useful in any future project
- Tied to codemap's "observability for AI" theme

---

## 9. 🚨 Failure Modes & Mitigation

### If you're behind at hour X, ship what's working

| At hour | If incomplete, drop... | Don't drop... |
|---|---|---|
| 1:45 (auth not done) | Magic link → use **demo password hardcoded in seed** | DB schema, deploy step |
| 3:30 (UI behind) | Drop `/startups/[id]` detail page → put updates in modal on dashboard | Dashboard page itself |
| 4:15 (deploy issues) | Vercel CLI direct push, skip Vercel Git connect | Working URL of any kind |
| 5:30 (docs behind) | Trim AI_USAGE.md to 80 lines, skip ARCHITECTURE.md | README, skill, AI_USAGE |

### Hard rules
- **Never skip the deploy step.** A working Vercel URL beats a perfect localhost.
- **Never skip AI_USAGE.md.** It's the highest-signal doc.
- **Never skip the codemap reference.** It's free leverage.
- **If auth fails for 30+ min, fall back to a public read-only demo + auth-gated write.** Document the choice.

---

## 10. 🎤 Interview Prep — Pre-Rehearsed Talking Points

The vaga lists three later evaluation steps. Have crisp answers ready.

### Step 1: "Walk us through your case"
**Open with:** *"Three things to call out before the demo: (1) shipped on Vercel — here's the URL, (2) docs/AI_USAGE.md captures my actual workflow with prompts and what AI got wrong, (3) the codemap-tool linked in the README is mine — it visualizes Claude Code agents and is what I use to track my own AI workflows."*  → 30 seconds, all three layers planted.

### Step 2: "Code review session"
- Have **one self-criticism ready** for each: PRD, schema, a UI component, and the AI workflow doc. Self-criticism > defending.
- Anchor every defense in *trade-off language*: "I chose X because we had 6h; with more time I'd do Y."
- For their code reviews: lead with severity, location, and a *fix*, not just a finding. (This is literally the skill you're submitting.)

### Step 3: "How do you structure your AI toolchain?"
- Show codemap-tool live. *"I built this because I was tired of guessing what my agent was doing."*
- Talk hooks → server → WebSocket → render. Talk how the 248 tests caught regressions.
- Tie to the case: *"Same observability mindset shows up in AI_USAGE.md — I track what AI did and what I fixed."*

---

## 11. ✅ Pre-Submission Checklist

Before sending the email:

```
[ ] Vercel URL is live and the golden path works (login → dashboard → detail)
[ ] Demo credentials work via magic link OR are clearly listed
[ ] README starts with: live URL, screenshot, codemap-tool reference
[ ] Seed data is in DB (NOT lorem ipsum — real-sounding BR startup names)
[ ] AI_USAGE.md has at least 4 specific "AI got X wrong" entries
[ ] code-review.md skill is in `.claude/skills/` and is self-contained
[ ] All 5 deliverables visible in repo root or docs/
[ ] At least one TODO.md or honest "what I'd do next" section
[ ] Commit history is clean — no "wip" or "fix typo" noise
[ ] Repo description on GitHub is filled in
[ ] No secrets in git (`.env` gitignored, `.env.example` committed)
[ ] Submission email links to: repo, live URL, codemap-tool
```

---

## 12. 🔀 What Changed vs `first_brainstorm.md` (delta summary)

| Area | v1 | v2 |
|---|---|---|
| Time budget | 8h | <6h |
| Auth | Email+password | Magic link |
| Filters/search | Included | Cut |
| Risk history viz | Included | Cut |
| Role-based access | Included | Cut |
| Markdown updates | Included | Cut |
| Formal tests | Included | Cut → TODO |
| Codemap leverage | Not mentioned | **Featured throughout (3-layer narrative)** |
| AI_USAGE.md | Generic structure | **Specific 4-catch table + codemap case study** |
| Skill format | Generic markdown | **Claude Code drop-in skill** |
| Failure modes | Not addressed | **Hour-by-hour mitigation table** |
| Interview prep | Not addressed | **3 rehearsed openings** |

**Net effect:** ~25% less feature scope, ~40% more strategic positioning, same execution time, much higher signal-to-noise.

---

## 13. 🎯 Next Steps

1. **Review this brainstorm** — flag anything that feels off or over-engineered
2. **(Optional) Run `/define`** on this file → produces formal DEFINE doc with acceptance criteria
3. **(Optional) Run `/design`** → produces DESIGN doc with file-by-file plan
4. **OR skip straight to execution:** create the GitHub repo, init Next.js, and start the 5.5h timer

Recommended path given the time pressure: **skip /define and /design**. They're worth it for production features, not for a 6h case where this brainstorm v2 is already the spec. Just open Claude Code in a fresh repo and start at hour 0.

---

> **One last thing.** Bluefields says "generosidade, respeito, foco em família." Match that tone in your submission email. Be brief, name the live URL, mention you'd love to chat about codemap — and don't oversell. Confidence reads better than enthusiasm.
