# Startup Tracker 🚀

Professional portfolio tracking platform for accelerators and venture studios. Unified source of truth for startup status, risk, and updates — eliminating information silos across WhatsApp, email, and disparate Notion pages.

Built with Next.js 14, Supabase (Postgres + RLS), and Zod-enforced guardrails.

---

## Key Metrics

| Metric | Value |
|---|---|
| Monthly Cost | **$0.00** (Vercel Hobby + Supabase Free) |
| Interaction Latency | < 1s (Next.js Server Actions) |
| Type Safety | **100%** (Strict TypeScript + Zod) |
| Security Model | Row Level Security (RLS) forced at DB layer |

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | React Server Components for zero-bundle reads |
| **Styling** | Tailwind CSS + Shadcn/UI | Premium design system with Bluefields branding |
| **Auth** | Supabase Auth (Magic Link) | Passwordless, enterprise-grade authentication |
| **Database** | Supabase Postgres | Relational storage with RLS and automated triggers |
| **Validation** | Zod | Runtime guardrails at every Server Action boundary |

---

## AI-First Methodology

| Component | Method | Impact |
|---|---|---|
| **SDD Workflow** | Spec-Driven Development | Design-First approach (Brainstorm → Define → Design → Build). |
| **Diagram Agent** | Automated Visualization | Codebase analysis to generate professional Excalidraw diagrams. |
| **Zod Guardrails** | AI Safety | Automated runtime validation to prevent logic drift. |

---

## Diagrams

### 1. System Architecture
![System Architecture](./diagrams/architecture.png)

### 2. Data Flow
![Data Flow](./diagrams/data-flow.png)

### 3. Entity Relationship (ER)
![Data Model](./diagrams/data-model.png)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Environment Configuration
cp .env.example .env.local

# 3. Database Setup
# Run the migration in your Supabase SQL Editor:
# cat supabase/migrations/001_initial_schema.sql

# 4. Start Development
npm run dev
```

---

## Documentation

Detailed technical breakdown available in the `/docs` folder:

| Document | Description |
|---|---|
| [PRD](docs/PRD.md) | Problem statement, user stories, and acceptance criteria. |
| [Architecture](docs/ARCHITECTURE.md) | Security model, data flow, and tech stack rationale. |
| [AI Usage](docs/AI_USAGE.md) | Log of the human-AI pair programming process. |
| [Execution Plan](docs/EXECUTION_PLAN.md) | Timeline and retrospective. |
