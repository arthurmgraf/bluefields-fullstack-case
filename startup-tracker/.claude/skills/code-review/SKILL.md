---
name: code-review
description: |
  Structured AI-assisted code review with severity ratings, OWASP Top 10
  awareness, and Next.js / Server Actions / Supabase RLS-specific checks.
  Designed for projects that ship code Claude (or any LLM) generated, where
  the developer is the accountable reviewer. Generic — drop into any TS/Next
  project. Carries the observability mindset: every finding has a severity,
  a location, and a concrete fix.
---

# /code-review

> Drop-in Claude Code skill. Install: copy this file to `.claude/skills/code-review/SKILL.md` of any project.

---

## When to invoke

- After Claude (or any AI) generates >50 LOC in one shot
- Before opening a Pull Request
- Whenever a Server Action or migration is touched
- Whenever a security boundary is touched (auth, RLS, env vars)

---

## Procedure

1. **Diff** — Run `git diff` and `git status`; identify all touched files
2. **Walk the checklist** — One pass per category below; record findings
3. **Group by severity** — CRITICAL → HIGH → MEDIUM → LOW
4. **Concrete fixes for CRITICAL/HIGH** — Don't just flag; propose code
5. **Cite OWASP code where applicable** — e.g. A01:2021 (Broken Access Control)
6. **Output as a markdown table** the user can paste into a PR description

---

## Checklist

### Security (OWASP Top 10 alignment)

- [ ] **A01 — Broken Access Control:** Every Server Action / route handler calls `supabase.auth.getUser()` and redirects on null
- [ ] **A02 — Cryptographic Failures:** No secrets in `NEXT_PUBLIC_*` vars; HTTPS-only cookies; no plaintext tokens in logs
- [ ] **A03 — Injection:** No string-concatenated SQL; Supabase client (parameterized) or Drizzle/Prisma; no `eval`
- [ ] **A04 — Insecure Design:** Auth check at *both* middleware AND Server Action boundary (defense in depth)
- [ ] **A05 — Misconfiguration:** No `.env*` committed; RLS enabled on every table; CORS not `*`
- [ ] **A06 — Vulnerable Components:** `npm audit` clean; deps pinned (no `^` in package.json for prod-critical libs is debatable; pin on first incident)
- [ ] **A07 — ID & Auth Failures:** Magic-link redirect_to is locked to one allowed origin; no open redirects in `redirect()` arguments
- [ ] **A08 — Software/Data Integrity:** Server Actions validate input with Zod *before* any DB write
- [ ] **A09 — Logging & Monitoring:** Errors logged with context (`{ user_id, resource_id }`), not just `error.message`
- [ ] **A10 — SSRF:** Any URL passed to `fetch` from user input is validated/whitelisted

### Type safety

- [ ] **No `any`** — every `any` requires `// @ts-expect-error <reason>` justification
- [ ] **Zod at every external boundary** — Server Actions, route handlers, fetch responses
- [ ] **Generated DB types in use** — no hand-written shapes for Supabase reads
- [ ] **`unknown` narrowed before use** — no implicit assertions
- [ ] **No `as` casts to silence errors** — fix the type, don't bypass it

### Framework correctness (Next.js 14 App Router)

- [ ] **Server Components by default** — `'use client'` only for event handlers, hooks, browser APIs
- [ ] **`revalidatePath` after every mutation** — or the UI shows stale data
- [ ] **No server-only modules imported in client components** — `cookies()`, `headers()`, server SDKs
- [ ] **Forms work without JS** — use `<form action={serverAction}>`, not `onSubmit` only
- [ ] **`async/await` in route handlers** — Next.js 15+ requires awaiting `params` and `searchParams`

### Observability

- [ ] **Errors have context** — `console.error('actionName failed:', err.message, { id, userId })`
- [ ] **No stack traces leak to user** — sanitize errors before returning from Server Actions
- [ ] **No silent fallbacks** — empty arrays from a query masking RLS denial is a footgun; log it

### Hygiene

- [ ] **Self-documenting names** — comments only when the WHY is non-obvious
- [ ] **No commented-out code** — delete it; git remembers
- [ ] **No `console.log` in committed code** — `console.error` is fine; `console.log` is a smell
- [ ] **Imports are clean** — no unused, no relative `../../../`; use the `@/` alias

---

## Prompt template (paste to Claude)

```
Review the diff in the working tree against
.claude/skills/code-review/SKILL.md.

Return findings as a markdown table:

| Severity | File:Line | Finding | Suggested fix |

Severity scale: CRITICAL · HIGH · MEDIUM · LOW.
Group by severity (CRITICAL first).
For CRITICAL and HIGH, the "Suggested fix" column MUST contain concrete
code, not a description.
Cite OWASP code (A01..A10) where applicable.
Include a final TL;DR row: "X CRITICAL, Y HIGH, Z MEDIUM, W LOW".
```

---

## Output example

```markdown
### CRITICAL

| File:Line | Finding | Suggested fix |
|-----------|---------|---------------|
| `actions/startups.ts:14` | Server Action mutates without auth check (OWASP A01:2021 — Broken Access Control). The action would accept forged form POSTs from unauthenticated origins. | Add before the insert: `const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login');` |

### HIGH

| File:Line | Finding | Suggested fix |
|-----------|---------|---------------|
| `lib/supabase/server.ts:9` | `process.env.NEXT_PUBLIC_SUPABASE_URL!` non-null assertion silently drops the missing-env case. App will crash with an unhelpful error at the first DB call. | Read once at module top with explicit guard: `const URL = process.env.NEXT_PUBLIC_SUPABASE_URL; if (!URL) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');` |

### MEDIUM

| File:Line | Finding | Suggested fix |
|-----------|---------|---------------|
| `components/startup-card.tsx:18` | `formatRelativeTime` is called inside a Server Component that re-renders on every nav; for cards that haven't changed, the relative time string drifts as time passes since render. | Acceptable for MVP; for production, render a `<time>` element with `datetime` attr and update via a tiny client component if precision matters. |

### LOW

| File:Line | Finding | Suggested fix |
|-----------|---------|---------------|
| `app/(authed)/page.tsx:7` | `export const dynamic = 'force-dynamic'` is correct here but should have a one-line comment explaining why (auth-dependent + RLS-filtered). | Add: `// force-dynamic: page is per-user via RLS; no static caching.` |

### TL;DR

**1 CRITICAL · 1 HIGH · 1 MEDIUM · 1 LOW.** Fix the CRITICAL before merging.
```

---

## Why this skill exists

AI-generated code looks right *at a glance*. The bugs hide in:

- Auth checks that are present but in the wrong place
- RLS policies that look strict but allow `using (true)`
- Type assertions that silence the compiler instead of fixing the type
- Missing `revalidatePath` calls that produce "ghost" stale UI

A checklist is the cheapest possible defense. This file is that checklist.

The discipline is: never merge AI-generated code without running this skill against the diff.

---

## Customizing for your stack

If you're not on Next.js 14 + Supabase, fork this file and swap:

- **Framework correctness** section → your framework's idioms
- **Security** section → keep OWASP, swap RLS-specific lines for your auth model
- **Type safety** section → applies as-is to any TypeScript project

The structure (severity → location → finding → fix) is the durable part. The checklist content is replaceable.
