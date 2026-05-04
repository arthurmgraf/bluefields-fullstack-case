# Fullstack Developer (AI-First) — Case Submission

> **Live demo:** _set after deploy_ → `https://<your-app>.vercel.app`
> **Product:** [`startup-tracker/`](startup-tracker/) — Next.js 14 + Supabase MVP
> **Author:** [Arthur Graf](https://github.com/arthurmgraf) · MIT-licensed

---

## What's in this repo

| Path | What you'll find |
|------|------------------|
| [`startup-tracker/`](startup-tracker/) | The actual MVP: Next.js 14 + Supabase + Tailwind + Shadcn. Generic "Startup Tracker" product, reusable for any accelerator. |
| [`startup-tracker/docs/AI_USAGE.md`](startup-tracker/docs/AI_USAGE.md) | ⭐ How AI was used: toolchain, loop, prompts, **what AI got wrong + how I caught it** |
| [`startup-tracker/docs/ARCHITECTURE.md`](startup-tracker/docs/ARCHITECTURE.md) | System design, 6 key decisions, data flow, security model |
| [`startup-tracker/docs/PRD.md`](startup-tracker/docs/PRD.md) | Concise PRD: problem, personas, MoSCoW, acceptance |
| [`startup-tracker/diagrams/`](startup-tracker/diagrams/) | 3 Excalidraw diagrams: architecture, data-flow, data-model |
| [`startup-tracker/.claude/skills/code-review/SKILL.md`](startup-tracker/.claude/skills/code-review/SKILL.md) | The 5th deliverable: a reusable Claude Code skill for AI-assisted code review |
| [`.claude/sdd/features/`](.claude/sdd/features/) | The full SDD trail: BRAINSTORM → DEFINE → DESIGN that drove this build |
| [`.claude/sdd/reports/`](.claude/sdd/reports/) | BUILD_REPORT with file inventory + deploy handoff steps |

## The 5 case deliverables

1. **PRD** → [`startup-tracker/docs/PRD.md`](startup-tracker/docs/PRD.md)
2. **Execution plan** → [`startup-tracker/docs/EXECUTION_PLAN.md`](startup-tracker/docs/EXECUTION_PLAN.md)
3. **Working MVP** → live URL above + [`startup-tracker/`](startup-tracker/)
4. **AI usage doc** → [`startup-tracker/docs/AI_USAGE.md`](startup-tracker/docs/AI_USAGE.md) ⭐
5. **Reusable skill** → [`startup-tracker/.claude/skills/code-review/SKILL.md`](startup-tracker/.claude/skills/code-review/SKILL.md)

## How to read this in 30 seconds

1. **Open the live URL above.** Sign in with your email (magic link) and click around.
2. **Read [`AI_USAGE.md`](startup-tracker/docs/AI_USAGE.md).** It has the toolchain, the loop, and a 4-row table of mistakes the AI made and how I caught them.
3. **Skim [`ARCHITECTURE.md`](startup-tracker/docs/ARCHITECTURE.md) §"Key decisions"** — six decisions, each with rationale and the alternatives I rejected.

That's the whole submission. Everything else is supporting evidence.

## How to read this in 5 minutes

Add to the above:

4. Open [`startup-tracker/diagrams/architecture.excalidraw`](startup-tracker/diagrams/architecture.excalidraw) at [excalidraw.com](https://excalidraw.com).
5. Walk [`startup-tracker/src/actions/updates.ts`](startup-tracker/src/actions/updates.ts) — it's the canonical pattern for every Server Action in the app (Zod boundary → auth check → mutation → mirror → revalidatePath).
6. Read [`TODO.md`](startup-tracker/TODO.md) — what was deferred, with explicit reasons.

## How to actually run it locally

See [`startup-tracker/README.md`](startup-tracker/README.md). Short version: `npm install`, fill `.env.local` from `.env.example`, run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor, then `npm run dev`.

---

## About the build

Built with **Claude Code (Opus 4.7)** as primary pair, following the SDD (Spec-Driven Development) workflow:

```
/brainstorm  →  /define  →  /design  →  manual execution
   ✅            ✅           ✅           ✅
```

All three SDD artifacts are committed in [`.claude/sdd/features/`](.claude/sdd/features/). They show the design-time reasoning, not just the result.

The product itself is **fully generic** — "Startup Tracker" works for any accelerator or venture studio. No Bluefields-specific code or branding inside `startup-tracker/`. The hiring-process artifacts (BRAINSTORM, DEFINE, DESIGN) live outside the product folder.

---

## License

[MIT](LICENSE) — adapt freely.
