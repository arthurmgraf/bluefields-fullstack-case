# Startup Tracker 🚀

![CI](https://github.com/arthurmgraf/bluefields-fullstack-case/actions/workflows/ci.yml/badge.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth--DB-green)
![Vercel Cost](https://img.shields.io/badge/Vercel%20cost-%240.00%2Fmo-brightgreen)

Enterprise-ready portfolio tracking platform for accelerators and venture studios. Unified source of truth for startup status, risk, and updates — eliminating information silos across WhatsApp, email, and disparate Notion pages.

Built for scale with Next.js 14, Supabase (Postgres + RLS), and Zod-enforced guardrails.

---

## Key Metrics

| Metric | Value |
|---|---|
| Monthly Cost | **$0.00** (Vercel Hobby + Supabase Free) |
| Interaction Latency | < 1s (Next.js Server Actions) |
| Type Safety | **100%** (Strict TypeScript + Zod) |
| Security Model | Row Level Security (RLS) forced at DB layer |
| CI/CD | Vercel Automatic Deploys |
| Data Integrity | ACID compliant Postgres + Zod validation |

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
![System Architecture](./diagrams/architecture.png)

### 2. Data Flow
Detailed flows for Reads (RSC), Writes (Actions), and Auth (Magic Link).
![Data Flow](./diagrams/data-flow.png)

### 3. Entity Relationship (ER)
Database schema with Foreign Keys and RLS policy annotations.
![Data Model](./diagrams/data-model.png)

---

## Repository Structure

```
startup-tracker/
├── src/
│   ├── app/                       # Next.js App Router (Pages & Routes)
│   ├── actions/                   # Server Actions (Business Logic)
│   ├── components/                # UI Components (Shadcn + Bluefields Theme)
│   └── lib/                       # Supabase Config, Zod Schemas & Utils
├── supabase/
│   ├── migrations/                # Postgres Schema & RLS Policies
│   └── seed.sql                   # Sample Portfolio Data
├── docs/                          # In-depth Documentation
│   ├── PRD.md                     # Requirements & User Stories
│   ├── ARCHITECTURE.md            # Design Decisions & Security Deep-dive
│   ├── AI_USAGE.md                # Honest log of AI assistance
│   └── EXECUTION_PLAN.md          # Development timeline & retrospective
├── diagrams/                      # Excalidraw sources & PNG exports
├── public/                        # Static assets & brand logos
└── scripts/                       # Operational & demo setup scripts
```

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional for local dev)
- [GCP/Vercel account](https://vercel.com) (for deployment)

### Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/arthurmgraf/bluefields-fullstack-case.git
cd bluefields-fullstack-case
npm install

# 2. Environment Configuration
# Copy .env.example and populate with your Supabase credentials
cp .env.example .env.local

# 3. Database Setup
# Run the migration in your Supabase SQL Editor:
# cat supabase/migrations/001_initial_schema.sql

# 4. Start Development
npm run dev
# Open http://localhost:3000
```

---

## Cost Analysis

| Service | Tier | Usage | Cost |
|---|---|---|---|
| **Vercel** | Hobby | App Hosting + Edge Functions | $0.00 |
| **Supabase DB** | Free | 500MB Postgres | $0.00 |
| **Supabase Auth** | Free | Up to 50k MAU | $0.00 |
| **GitHub** | Free | CI/CD + Repo | $0.00 |

**Total: $0.00/month.** Leveraging permanent free tiers for zero-cost enterprise operations.

---

## Documentation

Detailed technical breakdown available in the `/docs` folder:

| Document | Description |
|---|---|
| [Product Requirements (PRD)](docs/PRD.md) | Problem statement, user stories (MoSCoW), and acceptance criteria. |
| [Architecture Deep-dive](docs/ARCHITECTURE.md) | Security model (RLS), data flow, and tech stack rationale. |
| [AI Usage Log](docs/AI_USAGE.md) | Documentation of the human-AI pair programming process. |
| [Execution Plan](docs/EXECUTION_PLAN.md) | Timeline, retrospect, and reusable patterns extracted. |

---

## Author

**Arthur Maia Graf**

[LinkedIn](https://linkedin.com) | [GitHub](https://github.com/arthurmgraf)
