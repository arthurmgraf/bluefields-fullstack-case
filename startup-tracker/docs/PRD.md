# PRD — Startup Tracker

> Product Requirements Document for the MVP. Concise on purpose: every section is one screen of reading.

| Field | Value |
|---|---|
| **Product** | Startup Tracker |
| **Version** | 0.1 (MVP) |
| **Date** | 2026-05-04 |
| **Owner** | Solo build |

---

## 1. Problem

Accelerators and venture studios track 10s–100s of startups in their portfolio. The status of each lives in WhatsApp, email, Notion, Google Drive, and tribal knowledge. The cost: 4–6 hours/day lost to information hunting, late detection of struggling startups, and decision-making with no shared source of truth.

**Pain quote:** *"I have to message 5 people to know if Startup X is on track this week."*

---

## 2. Goal

A single authenticated web app where any team member can:

- See **every startup** in the portfolio in one view, with current risk level
- Open any startup and see its **full update history** chronologically
- **Add an update** in <30 seconds: progress, blockers, next steps, risk level

---

## 3. Personas

| Persona | Role | What they do here |
|---------|------|---|
| **Portfolio lead** | Manages the accelerator's investment cohort | Skims dashboard daily, drills into red/yellow startups |
| **Acceleration analyst** | Direct contact with founders | Adds weekly updates after each call |

> The MVP collapses both personas into a single "authenticated user" role. Admin/viewer split is deferred (see §8).

---

## 4. User stories (MoSCoW)

### Must Have

- **US-1** As a team member, I sign in with my work email so I don't have to remember another password
- **US-2** As a team member, I see all startups in one grid with their current risk so I can spot fires immediately
- **US-3** As a team member, I click into a startup and see its full update history chronologically
- **US-4** As a team member, I add a new update with progress / blockers / next steps / risk in one form
- **US-5** As a team member, I can register a new startup the team is now tracking
- **US-6** As an admin, anonymous traffic cannot read or write any data

### Should Have

- **US-7** As a team member, I see how many startups are 🟢 / 🟡 / 🔴 at the top of the dashboard
- **US-8** As a team member, the most-recently-updated startups surface first

### Could Have (deferred)

- Filters and search on dashboard
- Inline edit of risk_level on cards
- Risk history visualization (sparkline of risk over time)
- Markdown rendering in updates
- Edit/delete updates (currently append-only)
- Admin/viewer role split

---

## 5. Functional requirements

| ID | Requirement |
|----|---|
| FR-1 | Magic-link sign-in via Supabase Auth |
| FR-2 | Dashboard lists all startups, ordered by `updated_at DESC` |
| FR-3 | Dashboard shows summary counts grouped by `risk_level` |
| FR-4 | Detail page shows startup metadata + chronological update list (newest first) |
| FR-5 | Inline form on detail page creates a new update |
| FR-6 | Creating an update mirrors `risk_level` to the parent startup |
| FR-7 | Inline form on dashboard creates a new startup |
| FR-8 | Sign-out clears the session and redirects to `/login` |

## 6. Non-functional requirements

| ID | Requirement |
|----|---|
| NFR-1 | All data access enforced at DB layer via Row Level Security |
| NFR-2 | Zero `any` types in production code |
| NFR-3 | Every Server Action validates input with Zod before any DB call |
| NFR-4 | p95 page load < 2s on Vercel free tier (cold) |
| NFR-5 | Magic-link delivery completes in < 30s |
| NFR-6 | UI works without JavaScript for the auth flow (form actions) |

---

## 7. Acceptance criteria (smoke checklist)

- [ ] Submit valid email at `/login` → magic-link arrives → click → land on `/`
- [ ] Dashboard shows seeded startups with correct risk badges
- [ ] Click any card → detail page loads with metadata + update timeline
- [ ] Submit a new update → it appears at the top of the timeline; parent risk reflects the new level
- [ ] Open `/startups/{any-uuid}` in incognito → redirected to `/login`
- [ ] Submit form with empty `content` → validation error shown; no DB write
- [ ] Submit form with invalid `risk_level` → rejected by Zod; no DB write
- [ ] Sign out → cookie cleared → cannot access `/`

---

## 8. Out of scope (MVP)

- Filters / search
- Risk history visualization
- Role-based access control (admin/viewer)
- Markdown editor for updates
- Edit / delete updates
- Notifications / email digests
- WhatsApp / Slack integrations
- File uploads (pitch decks)
- Multi-tenancy
- AI features inside the product

---

## 9. Technical constraints

- **Stack** locked: Next.js 14 (App Router) + Supabase + Vercel + TypeScript + Tailwind + Shadcn + Zod
- **Free tier only**: Vercel Hobby + Supabase Free
- **Time budget**: 6h hard wall-clock for the original build
- **No service-role key** in the app — anon key + RLS only

---

## 10. Diagrams

See [`../diagrams/`](../diagrams/) for three Excalidraw diagrams:
- `architecture.excalidraw` — System overview (Browser → Vercel/Next.js → Supabase)
- `data-flow.excalidraw` — Read flow, write flow, auth flow on one canvas
- `data-model.excalidraw` — ER schema with FKs and an annotated RLS summary
