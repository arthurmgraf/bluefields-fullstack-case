# Diagrams

Three Excalidraw diagrams that explain the application end-to-end. Open them at [excalidraw.com](https://excalidraw.com) → File → Open, or in any Excalidraw-compatible editor (the VS Code Excalidraw extension renders them inline).

| Diagram | What it shows | When to read it |
|---------|---------------|-----------------|
| [`architecture.excalidraw`](architecture.excalidraw) | High-level system: Browser → Vercel Edge (Next.js + middleware + RSC + Server Actions + Zod) → Supabase (Auth + Postgres with RLS) | First-time orientation |
| [`data-flow.excalidraw`](data-flow.excalidraw) | Three flows on one canvas: Read (RSC dashboard), Write (Server Action with Zod boundary), Auth (magic-link OTP) | Understanding the runtime mechanics |
| [`data-model.excalidraw`](data-model.excalidraw) | ER schema of `profiles · startups · startup_updates` with FKs and an annotated RLS policy summary | Before touching the migration or writing a query |

## Color semantics (consistent across all three)

| Color | Meaning |
|-------|---------|
| 🟦 Blue | Browser / HTML / user-facing surface |
| 🟨 Yellow | Vercel / Next.js (middleware, route handlers, RSC) |
| 🟩 Green | Supabase (Auth, Postgres, RLS-protected boundary) |
| 🩷 Pink | Server Actions (mutations) |
| 🟪 Purple | Zod schemas (runtime validation) |
| 🟥 Red dashed | RLS / security boundary |

## Regenerating

These were authored by hand against the `DESIGN_BLUEFIELDS_TRACKER.md` reference. To regenerate from the codebase, invoke the Claude Code skill `/generate-diagrams` (the `diagram-generator-agent` is configured in this repo's `.claude/agents/`).
