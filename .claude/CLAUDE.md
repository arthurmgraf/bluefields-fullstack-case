# Bluefields Fullstack Developer Case (AI-First)

> Hiring-case repo for the Bluefields **Fullstack Developer (AI-First)** position. Goal: ship a working AI-augmented Next.js + Supabase MVP in <6h, with a documentation trail credible enough to pass technical and cultural evaluation.

---

## Repo Layout

```
case_fullstack_developer/
├── .claude/                    # Claude Code config (agents, skills, SDD, commands)
│   ├── sdd/features/           # ⭐ All SDD artifacts live here (BRAINSTORM, DEFINE, DESIGN)
│   ├── agents/                 # Specialized agents
│   ├── skills/                 # Drop-in Claude Code skills
│   └── commands/               # Custom slash commands
│
├── codemap-tool/               # Sibling portfolio piece — visualizes Claude Code agents
│                                 (TypeScript + React + Express + WebSocket, 248 tests)
│
├── bluefields-tracker/         # ← Will be created during execution. Next.js 14 + Supabase MVP.
│
├── first_brainstorm.md         # Original brainstorm v1 (preserved for diff)
├── vaga.md                     # Job posting
└── git_projeto.md              # Source repo URL
```

---

## SDD Artifacts (current case)

| Phase | File |
|-------|------|
| BRAINSTORM v2 | [.claude/sdd/features/BRAINSTORM_BLUEFIELDS_TRACKER.md](sdd/features/BRAINSTORM_BLUEFIELDS_TRACKER.md) |
| DEFINE | [.claude/sdd/features/DEFINE_BLUEFIELDS_TRACKER.md](sdd/features/DEFINE_BLUEFIELDS_TRACKER.md) |
| DESIGN | [.claude/sdd/features/DESIGN_BLUEFIELDS_TRACKER.md](sdd/features/DESIGN_BLUEFIELDS_TRACKER.md) |

The DESIGN doc has a 48-file manifest across 5 work groups and 10 copy-paste-ready code patterns. Open it in a split pane during execution.

---

## Coding Standards (carried from `codemap-tool/`)

- **TypeScript:** strict mode, `interface` for contracts, `type` for unions, **zero `any`**
- **Naming:** PascalCase components, camelCase functions, UPPER_SNAKE_CASE constants
- **Tests:** Vitest with `.test.ts` colocation (deferred for the MVP — see DESIGN §Decision 5)
- **Errors:** try/catch only at I/O boundaries, `console.error` with structured context
- **Folders:** flat, organized by concern (`components/`, `actions/`, `lib/`)
- **Validation:** Zod schemas at every Server Action boundary

---

## Stack (locked for MVP)

```
Frontend  → Next.js 14 (App Router) + RSC + Tailwind + Shadcn/UI
Backend   → Server Actions + Zod
Data/Auth → Supabase (Postgres + Auth + RLS)
Deploy    → Vercel
```

---

## Time Budget

**< 6h hard wall-clock.** See BRAINSTORM §5 for the hour-by-hour timeline and §9 for the failure-mode table (what to drop if behind at hour X).

---

## The 5 Required Deliverables

| # | Deliverable | Path |
|---|-------------|------|
| 1 | PRD enxuto | `bluefields-tracker/docs/PRD.md` |
| 2 | Plano de execução com IA | `bluefields-tracker/docs/EXECUTION_PLAN.md` |
| 3 | MVP fullstack funcional | live Vercel URL + repo |
| 4 | Documentação de uso de IA | `bluefields-tracker/docs/AI_USAGE.md` ⭐ |
| 5 | Skill reutilizável | `bluefields-tracker/.claude/skills/code-review.md` |

---

## Strategic Positioning (the big lever)

`codemap-tool/` is a fullstack TypeScript+React+Express+WebSocket project that visualizes Claude Code & Cursor agents — built by the candidate. The Bluefields job posting literally asks candidates to *"show your own vibe coding workflow."* codemap-tool is a pre-built answer to that interview question.

**3-layer narrative** (per BRAINSTORM §0):
- **Layer 1** — Functional proof: shipped Bluefields tracker MVP
- **Layer 2** — Reflective proof: AI_USAGE.md with specific "what AI got wrong" entries
- **Layer 3** — Portfolio proof: codemap-tool reference (toolchain interview pre-answered)

---

## Workflow

This repo uses AgentSpec 5.0 (Spec-Driven Development) at `.claude/sdd/`.

```
/brainstorm  →  /define  →  /design  →  (manual exec)  →  /ship
   ✅            ✅           ✅           ← you are here
```

Given the <6h budget, manual execution beats `/build` orchestration overhead. Open the DESIGN file manifest, drive top-down through Work Groups A → E.

---

## Source Documents

- **Job posting:** `vaga.md`
- **Case repo (Bluefields):** `git_projeto.md` → `https://github.com/bluefieldsdev/bluefields-vagas`
- **Original brainstorm v1 (preserved):** `first_brainstorm.md`
