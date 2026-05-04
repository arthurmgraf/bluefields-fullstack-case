# AgentSpec 5.0 Architecture

> Visual reference for the parallel SDD + Dev Loop workflow with worktrees, auto-review, dashboard, and contextual guidance

---

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   AGENTSPEC 5.0 PIPELINE                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                          │
│   PHASE 0              PHASE 1              PHASE 2              PHASE 3              PHASE 4           │
│   ════════             ════════             ════════             ════════             ════════          │
│   BRAINSTORM           DEFINE               DESIGN               BUILD                SHIP              │
│   (Explore)            (What + Why)         (How)                (Do)                 (Close)           │
│   [Optional]                                [Parallel            [Parallel                             │
│                                              Research]            Worktrees]                           │
│                                                                                                          │
│   /brainstorm          /define              /design              /build               /ship             │
│        │                    │                    │                    │                    │            │
│        ▼                    ▼                    ▼                    ▼                    ▼            │
│   ┌──────────┐         ┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐      │
│   │BRAINSTORM│────────▶│ DEFINE  │─────────▶│ DESIGN  │─────────▶│  BUILD  │─────────▶│  SHIP   │      │
│   │  AGENT   │ or skip │  AGENT  │          │  AGENT  │          │  AGENT  │          │  AGENT  │      │
│   │  (Opus)  │         │ (Opus)  │          │ (Opus)  │          │(Sonnet) │          │(Haiku)  │      │
│   └──────────┘         └─────────┘          └────┬────┘          └────┬────┘          └────┬────┘      │
│                                                  │                    │                    │            │
│                                            Parallel            Parallel          Auto-diagrams          │
│                                            Research            Worktrees         + HISTORY              │
│                                                                    │                                    │
│                                                              Auto-Review                                │
│                                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Parallel /design (Background Research)

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         /DESIGN PARALLEL RESEARCH                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  Leader reads DEFINE_{FEATURE}.md                                                        │
│     │                                                                                    │
│     ├──▶ Subagent A (background: true)                                                   │
│     │    "Search existing codebase patterns, conventions, integration points"            │
│     │    tools: [Read, Glob, Grep]                                                      │
│     │                                                                                    │
│     ├──▶ Subagent B (background: true)                                                   │
│     │    "Search relevant KB domains (crewai, gcp, pydantic, etc.)"                     │
│     │    tools: [Read, Glob, Grep]                                                      │
│     │                                                                                    │
│     └──▶ [Optional] Subagent C (background: true)                                        │
│          "Search external documentation"                                                 │
│          tools: [Read, Glob, Grep]                                                      │
│                                                                                          │
│  Leader awaits all results → Synthesizes → Generates DESIGN with work groups            │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Parallel /build (Worktree Orchestration)

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         /BUILD PARALLEL FLOW                                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  1. PARSE      Leader reads DESIGN manifest                                              │
│     │          Identifies work groups (files with no cross-dependencies)                 │
│     ▼                                                                                    │
│  2. PLAN       For each work group:                                                      │
│     │          → Spawns subagent with permissionMode: plan                               │
│     │          → Subagent generates plan (read-only)                                     │
│     │          → Leader approves or rejects each plan                                   │
│     ▼                                                                                    │
│  3. EXECUTE    Approved subagents run in parallel:                                       │
│     │          ┌──────────────┬──────────────┬──────────────┐                           │
│     │          │ Worktree A   │ Worktree B   │ Worktree C   │                           │
│     │          │ isolation:   │ isolation:   │ isolation:   │                           │
│     │          │  worktree    │  worktree    │  worktree    │                           │
│     │          │ background:  │ background:  │ background:  │                           │
│     │          │  true        │  true        │  true        │                           │
│     │          └──────┬───────┴──────┬───────┴──────┬───────┘                           │
│     ▼                 │              │              │                                   │
│  4. COLLECT    Leader awaits all subagents                                               │
│     │          Collects results                                                          │
│     ▼                                                                                    │
│  5. MERGE      Git merge each worktree to main branch                                    │
│     │          If conflict: report to user, do NOT auto-merge                            │
│     ▼                                                                                    │
│  6. VERIFY     ruff check + pytest on merged code                                        │
│     │          Cache: only re-checks modified files (git diff based)                    │
│     ▼                                                                                    │
│  7. REPORT     BUILD_REPORT with didactic explanations per file                          │
│     │          DASHBOARD updated with final status                                       │
│     ▼                                                                                    │
│  8. REVIEW     code-reviewer runs automatically                                          │
│                Generates REVIEW_REPORT                                                   │
│                Saves patterns to memory: project                                         │
│                                                                                          │
│  DASHBOARD: Updated after each step (parse/plan/execute/merge/verify/review)            │
│  DOCKER AFK: If --docker flag, each worktree runs in container                           │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Dev Loop with team_size

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         DEV LOOP WITH team_size                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  PROMPT.md with team_size: 3                                                             │
│     │                                                                                    │
│     ├──▶ Tasks RISKY: Sequential (fail fast)                                             │
│     │                                                                                    │
│     ├──▶ Tasks CORE: Grouped into N batches                                              │
│     │    ┌─────────┬─────────┬─────────┐                                                │
│     │    │ Agent 1 │ Agent 2 │ Agent 3 │                                                │
│     │    │ Task A  │ Task B  │ Task C  │                                                │
│     │    │ Task D  │ Task E  │ Task F  │                                                │
│     │    └────┬────┴────┬────┴────┬────┘                                                │
│     │         │         │         │                                                     │
│     │         └────┬────┘         │                                                     │
│     │              ▼              │                                                     │
│     │         Results aggregated                                                        │
│     │                                                                                    │
│     └──▶ Tasks POLISH: Sequential (cleanup)                                              │
│                                                                                          │
│  PROGRESS.md: Tracks all agents + tasks                                                  │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Contextual Guidance (All Phases)

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         CONTEXTUAL GUIDANCE STANDARD                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  Every phase ends with:                                                                  │
│                                                                                          │
│  ---                                                                                     │
│  Concluded: /{phase} {input_path}                                                        │
│                                                                                          │
│  Artifacts generated:                                                                    │
│    - {TYPE}: {full_path}                                                                 │
│    - {TYPE}: {full_path}                                                                 │
│                                                                                          │
│  Next step: /{next_phase} {main_artifact_path}                                           │
│  ---                                                                                     │
│                                                                                          │
│  /brainstorm:                                                                            │
│    Artifacts: BRAINSTORM_{FEATURE}.md                                                    │
│    Next: /define .claude/sdd/features/BRAINSTORM_{FEATURE}.md                           │
│                                                                                          │
│  /define:                                                                                │
│    Artifacts: DEFINE_{FEATURE}.md                                                        │
│    Next: /design .claude/sdd/features/DEFINE_{FEATURE}.md                               │
│                                                                                          │
│  /design:                                                                                │
│    Artifacts: DESIGN_{FEATURE}.md                                                        │
│    Next: /build .claude/sdd/features/DESIGN_{FEATURE}.md                                │
│                                                                                          │
│  /build:                                                                                 │
│    Artifacts: BUILD_REPORT, REVIEW_REPORT, DASHBOARD, code files                        │
│    Next: /ship .claude/sdd/features/DEFINE_{FEATURE}.md                                 │
│                                                                                          │
│  /ship:                                                                                  │
│    Artifacts: SHIPPED_{DATE}.md, HISTORY_{FEATURE}.md, archive/                         │
│    Next: (none - feature complete)                                                       │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Flow

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    WORKFLOW FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   RAW IDEA                                                                               │
│   (vague request,          PHASE 0: BRAINSTORM (Optional)                               │
│    problem)          ────────────────────────▶   BRAINSTORM_{FEATURE}.md               │
│                            One Q at a time       - Discovery Q&A                        │
│                            2-3 Approaches        - Approaches Explored                  │
│                            YAGNI Ruthlessly      - Features Removed                     │
│                                                  - Selected Approach                    │
│                                  │                                                      │
│                                  ▼                                                      │
│   RAW INPUT                                                                              │
│   (notes, emails,          PHASE 1: DEFINE                                              │
│    brainstorm doc)   ────────────────────────▶   DEFINE_{FEATURE}.md                   │
│                            Extract + Validate    - Problem Statement                    │
│                            Clarity Score ≥12     - Target Users                         │
│                                                  - Success Criteria                     │
│                                                  - Acceptance Tests                     │
│                                                  - Out of Scope                         │
│                                  │                                                      │
│                                  ▼                                                      │
│                           PHASE 2: DESIGN (Parallel Research)                           │
│   DEFINE_{FEATURE}.md ───────────────────────▶   DESIGN_{FEATURE}.md                   │
│                            Parallel research     - Architecture Diagram                 │
│                            Work group split      - Key Decisions (inline)               │
│                                                  - File Manifest + Work Groups          │
│                                                  - Code Patterns                        │
│                                                  - Testing Strategy                     │
│                                  │                                                      │
│                                  ▼                                                      │
│                           PHASE 3: BUILD (Parallel Worktrees)                           │
│   DESIGN_{FEATURE}.md ───────────────────────▶   CODE + BUILD_REPORT                   │
│                            Plan Mode approval    + REVIEW_REPORT                        │
│                            Parallel worktrees    + DASHBOARD                            │
│                            Auto-review           - All files from manifest              │
│                                                  - Verification results                 │
│                                  │                                                      │
│                                  ▼                                                      │
│                           PHASE 4: SHIP                                                 │
│   All Artifacts      ────────────────────────▶   archive/{FEATURE}/                    │
│                            Auto-diagrams         - All artifacts archived               │
│                            History index         - SHIPPED_{DATE}.md                   │
│                                                  - HISTORY_{FEATURE}.md                │
│                                                  - Lessons learned                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```text
.claude/
├── commands/
│   └── workflow/
│       ├── brainstorm.md      # Phase 0 command (optional)
│       ├── define.md          # Phase 1 command
│       ├── design.md          # Phase 2 command (parallel research)
│       ├── build.md           # Phase 3 command (parallel worktrees)
│       ├── ship.md            # Phase 4 command (auto-diagrams + history)
│       ├── iterate.md         # Cross-phase update
│       └── create-pr.md       # Utility (unchanged)
│
├── agents/
│   └── workflow/
│       ├── brainstorm-agent.md # Collaborative exploration
│       ├── define-agent.md     # Requirements extraction
│       ├── design-agent.md     # Architecture design + parallel research
│       ├── build-agent.md      # Worktree orchestration + auto-review
│       ├── ship-agent.md       # Archive + auto-diagrams + history
│       └── iterate-agent.md    # Change management
│
└── sdd/
    ├── _index.md              # Workflow overview
    ├── features/              # Active BRAINSTORM + DEFINE + DESIGN docs
    │   ├── BRAINSTORM_*.md
    │   ├── DEFINE_*.md
    │   └── DESIGN_*.md
    ├── reports/               # Build and review reports
    │   ├── BUILD_REPORT_*.md
    │   ├── REVIEW_REPORT_*.md
    │   └── DASHBOARD_*.md
    ├── archive/               # Shipped features
    │   └── {FEATURE}/
    │       ├── BRAINSTORM_*.md  (if used)
    │       ├── DEFINE_*.md
    │       ├── DESIGN_*.md
    │       ├── BUILD_REPORT_*.md
    │       ├── REVIEW_REPORT_*.md
    │       ├── DASHBOARD_*.md
    │       ├── SHIPPED_*.md
    │       └── HISTORY_*.md
    ├── templates/             # Document templates
    │   ├── BRAINSTORM_TEMPLATE.md
    │   ├── DEFINE_TEMPLATE.md
    │   ├── DESIGN_TEMPLATE.md
    │   ├── BUILD_REPORT_TEMPLATE.md
    │   ├── SHIPPED_TEMPLATE.md
    │   ├── DASHBOARD_TEMPLATE.md
    │   ├── REVIEW_REPORT_TEMPLATE.md
    │   └── HISTORY_TEMPLATE.md
    └── architecture/          # Workflow contracts
        ├── WORKFLOW_CONTRACTS.yaml
        └── ARCHITECTURE.md    # This file
```

---

## Model Assignment

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              STRATEGIC MODEL ASSIGNMENT                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌────────────────────────────────────────────────────────────────────────────────┐    │
│   │                                    OPUS                                         │    │
│   │                    (Nuanced Understanding & Creative Thinking)                  │    │
│   │                                                                                 │    │
│   │   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │    │
│   │   │   BRAINSTORM    │    │     DEFINE      │    │     DESIGN      │            │    │
│   │   │     AGENT       │    │     AGENT       │    │     AGENT       │            │    │
│   │   │                 │    │                 │    │                 │            │    │
│   │   │ Collaborative   │    │ Requirements    │    │ Architecture    │            │    │
│   │   │ exploration     │    │ extraction      │    │ + parallel      │            │    │
│   │   │                 │    │                 │    │ research        │            │    │
│   │   └─────────────────┘    └─────────────────┘    └─────────────────┘            │    │
│   └────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│   ┌────────────────────────────────────────────────────────────────────────────────┐    │
│   │                                   SONNET                                        │    │
│   │                           (Fast, Accurate Coding)                               │    │
│   │                                                                                 │    │
│   │   ┌─────────────────┐              ┌─────────────────┐                         │    │
│   │   │      BUILD      │              │     ITERATE     │                         │    │
│   │   │      AGENT      │              │      AGENT      │                         │    │
│   │   │                 │              │                 │                         │    │
│   │   │ Worktree orch.  │              │ Change          │                         │    │
│   │   │ + auto-review   │              │ management      │                         │    │
│   │   └─────────────────┘              └─────────────────┘                         │    │
│   └────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│   ┌────────────────────────────────────────────────────────────────────────────────┐    │
│   │                                    HAIKU                                        │    │
│   │                             (Fast, Simple Tasks)                                │    │
│   │                                                                                 │    │
│   │   ┌─────────────────┐                                                          │    │
│   │   │      SHIP       │                                                          │    │
│   │   │      AGENT      │                                                          │    │
│   │   │                 │                                                          │    │
│   │   │ Archive +       │                                                          │    │
│   │   │ history index   │                                                          │    │
│   │   └─────────────────┘                                                          │    │
│   └────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Quality Gates

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   QUALITY GATES                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   PHASE 0: BRAINSTORM (Optional)                                                         │
│   ══════════════════════════════                                                         │
│   [ ] Minimum 3 discovery questions asked                                                │
│   [ ] 2-3 approaches explored with trade-offs                                            │
│   [ ] YAGNI applied (features removed)                                                   │
│   [ ] Minimum 2 incremental validations completed                                        │
│   [ ] User confirmed selected approach                                                   │
│   [ ] Contextual guidance shown at end                                                   │
│                                                                                          │
│   PHASE 1: DEFINE                                                                        │
│   ═══════════════                                                                        │
│   [ ] Clarity Score >= 12/15                                                             │
│   [ ] All required sections present                                                      │
│   [ ] Contextual guidance shown at end                                                   │
│                                                                                          │
│   PHASE 2: DESIGN                                                                        │
│   ═══════════════                                                                        │
│   [ ] Architecture diagram present                                                       │
│   [ ] At least one decision with full rationale                                          │
│   [ ] Complete file manifest WITH Work Group column                                      │
│   [ ] Code patterns are copy-paste ready                                                 │
│   [ ] Testing strategy defined                                                           │
│   [ ] Work groups are independent (no cross-deps)                                        │
│   [ ] Contextual guidance shown at end                                                   │
│                                                                                          │
│   PHASE 3: BUILD                                                                         │
│   ══════════════                                                                         │
│   [ ] All subagents ran Plan Mode before implementing                                    │
│   [ ] All files from manifest created                                                    │
│   [ ] All verification commands pass                                                     │
│   [ ] Merge conflicts reported (not auto-merged)                                         │
│   [ ] BUILD_REPORT with didactic explanations                                            │
│   [ ] REVIEW_REPORT generated by code-reviewer                                           │
│   [ ] DASHBOARD updated to COMPLETE                                                      │
│   [ ] Contextual guidance shown at end                                                   │
│                                                                                          │
│   PHASE 4: SHIP                                                                          │
│   ═════════════                                                                          │
│   [ ] BUILD_REPORT shows 100% completion                                                 │
│   [ ] All tests passing                                                                  │
│   [ ] REVIEW_REPORT exists                                                               │
│   [ ] Diagrams generated (auto or manual)                                                │
│   [ ] HISTORY_{FEATURE}.md created                                                       │
│   [ ] Contextual guidance shown at end                                                   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
| ------- | ---- | ------- |
| 5.0.0 | 2026-02-25 | Parallel /build (worktrees), parallel /design (background research), auto-review, contextual guidance, team_size Dev Loop, dashboard, persistent memory, Docker AFK, cache verification, auto-diagrams, history index, didactic BUILD_REPORT |
| 4.2.0 | 2026-01-29 | Added Agent Matching (Design) + Agent Delegation (Build) |
| 4.1.0 | 2026-01-27 | Added Phase 0: Brainstorm (optional exploratory phase) |
| 4.0.0 | 2026-01-25 | Complete rewrite for 4-phase model |
