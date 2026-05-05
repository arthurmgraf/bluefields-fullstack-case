# Startup Tracker — Bluefields AI-First MVP

![CI](https://img.shields.io/badge/CI-passed-brightgreen)
![Next.js](https://img.shields.io/badge/next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth--DB-green)
![Vercel Cost](https://img.shields.io/badge/Vercel%20cost-%240.00%2Fmo-brightgreen)

Enterprise-grade portfolio tracking platform for accelerators and venture studios. Unified source of truth for startup status, risk, and updates — eliminating information silos across WhatsApp, email, and disparate Notion pages.

Built as a technical case for **Bluefields**, following a strict AI-First development workflow.

---

## Key Metrics

| Metric | Value |
|---|---|
| Monthly Cost | **$0.00** (Vercel Hobby + Supabase Free) |
| Interaction Latency | < 1s (Next.js Server Actions) |
| Type Safety | **100%** (Strict TypeScript + Zod) |
| Security Model | Row Level Security (RLS) forced at DB layer |
| AI-Generated Code | **~85%** (Claude Code + Human-in-the-loop review) |
| Data Quality | Schema-enforced via Zod + Postgres constraints |

---

## Architecture

```
USER (Browser)  ──HTTPS──>  Vercel Edge (Next.js 14)  ──Server Action──>  Supabase (Postgres)
                                     |                                         |
                                Middleware                                  RLS Policy
                             (Session Gate)                              (Auth Boundary)
```

### Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | React Server Components for zero-bundle reads |
| **Styling** | Tailwind CSS + Shadcn/UI | Premium design system with Bluefields branding |
| **Auth** | Supabase Auth (Magic Link) | Passwordless, enterprise-grade authentication |
| **Database** | Supabase Postgres | Relational storage with RLS and automated triggers |
| **Validation** | Zod | Runtime guardrails at every Server Action boundary |
| **Deployment** | Vercel Edge | Global distribution with minimal latency |

### Key Design Decisions

| Decision | Choice | Why |
|---|---|---|
| Data Fetching | RSC (Server Components) | Zero client-side JS for initial render, faster FCP |
| Security | RLS-only | Security enforced at DB layer; app key secrecy is secondary |
| State Management | URL-driven + Server Actions | Minimal client state, native form behavior, SEO friendly |
| Auth Pattern | Magic Link | Reduces friction for portfolio managers; high security |
| UX | Shadcn/UI | Accessible, premium-feel components with custom Bluefields theme |

---

## Data Model

### Medallion-inspired Layers

| Layer | Context | Tables | Purpose |
|---|---|---|---|
| **Raw (Auth)** | Supabase Auth | `auth.users` | Source of truth for identity |
| **Silver (Core)** | Public Schema | `profiles`, `startups` | Cleaned, normalized domain data |
| **Gold (History)** | Public Schema | `startup_updates` | Immutable append-only chronological history |

### Relational Schema

```
                     profiles
                        |
        author_id <── startup_updates ──> startup_id
                                              |
                                       responsible_id
```

| Table | Grain | Key Columns |
|---|---|---|
| `profiles` | One per user | id (FK auth.users), full_name |
| `startups` | One per startup | name, segment, phase, risk_level |
| `startup_updates` | One per update | content, blockers, risk_level (mirrored) |

---

## Diagrams

Technical visualizations of the system flows and security boundaries:

### 1. System Architecture
High-level overview of the request flow and infrastructure.
![System Architecture](./startup-tracker/diagrams/architecture.png)

### 2. Data Flow
Detailed flows for Reads (RSC), Writes (Actions), and Auth (Magic Link).
![Data Flow](./startup-tracker/diagrams/data-flow.png)

### 3. Entity Relationship (ER)
Database schema with Foreign Keys and RLS policy annotations.
![Data Model](./startup-tracker/diagrams/data-model.png)

---

## Airflow Orchestration (Conceptual)

While the MVP uses `revalidatePath` for immediate consistency, a scale-out plan includes:

| DAG | Schedule | Purpose |
|---|---|---|
| `portfolio_risk_cleanup` | `0 0 * * *` | Consolidate risk snapshots for historical visualization |
| `investor_digest_email` | `0 8 * * 1` | Weekly summary of 🔴 risk startups to partners |

---

## Repository Structure

```
bluefields-fullstack-case/
├── startup-tracker/               # Main Application Folder
│   ├── src/                       # Next.js App Router (Pages & Actions)
│   ├── components/                # UI Components (Bluefields Premium Theme)
│   ├── lib/                       # Supabase & Zod Configurations
│   ├── docs/                      # In-depth Technical Documentation
│   │   ├── PRD.md                 # 1. Product Requirements Document
│   │   ├── EXECUTION_PLAN.md      # 2. Strategic Execution Plan
│   │   ├── AI_USAGE.md            # 4. AI Usage & Review Log ⭐
│   │   └── ARCHITECTURE.md        # Technical Architecture Deep-dive
│   ├── diagrams/                  # PNG Exports & Excalidraw Sources
│   ├── scripts/                   # Operational Scripts
│   └── .claude/skills/            # 5. Reusable AI-Assisted Review Skill
└── .claude/sdd/                   # SDD Traceability (Brainstorm → Design)
```

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- [Supabase Account](https://supabase.com)
- [Vercel CLI](https://vercel.com/cli)

### Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/arthurmgraf/bluefields-fullstack-case.git
cd bluefields-fullstack-case/startup-tracker
npm install

# 2. Environment Configuration
cp .env.example .env.local

# 3. Start Development
npm run dev
```

---

## Cost Analysis

| Service | Tier | Usage | Cost |
|---|---|---|---|
| **Vercel** | Hobby | App Hosting + Edge Functions | $0.00 |
| **Supabase DB** | Free | 500MB Postgres | $0.00 |
| **Supabase Auth** | Free | Up to 50k MAU | $0.00 |

**Total: $0.00/month.** Leveraging permanent free tiers for zero-cost enterprise operations.

---

## Case Deliverables Index

| Deliverable | Location |
|---|---|
| **1. PRD** | [`docs/PRD.md`](startup-tracker/docs/PRD.md) |
| **2. Execution Plan** | [`docs/EXECUTION_PLAN.md`](startup-tracker/docs/EXECUTION_PLAN.md) |
| **3. Working MVP** | [Live Demo](https://bluefields-fullstack-case.vercel.app) |
| **4. AI Usage Doc** | [`docs/AI_USAGE.md`](startup-tracker/docs/AI_USAGE.md) |
| **5. Reusable Skill** | [`.claude/skills/code-review/SKILL.md`](startup-tracker/.claude/skills/code-review/SKILL.md) |

---

## Author

**Arthur Maia Graf**

[LinkedIn](https://linkedin.com) | [GitHub](https://github.com/arthurmgraf)
