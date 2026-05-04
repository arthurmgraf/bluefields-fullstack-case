# Build Command

> Execute implementation with parallel worktree orchestration (Phase 3)

## Usage

```bash
/build <design-file> [--docker]
```

## Examples

```bash
/build .claude/sdd/features/DESIGN_CLOUD_RUN_FUNCTIONS.md
/build DESIGN_USER_AUTH.md
/build .claude/sdd/features/DESIGN_USER_AUTH.md --docker
```

---

## Overview

This is **Phase 3** of the 5-phase AgentSpec workflow:

```text
Phase 0: /brainstorm → .claude/sdd/features/BRAINSTORM_{FEATURE}.md (optional)
Phase 1: /define     → .claude/sdd/features/DEFINE_{FEATURE}.md
Phase 2: /design     → .claude/sdd/features/DESIGN_{FEATURE}.md
Phase 3: /build      → Code + BUILD_REPORT + REVIEW_REPORT + DASHBOARD (THIS COMMAND)
Phase 4: /ship       → .claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md
```

The `/build` command orchestrates parallel implementation using git worktrees, Plan Mode quality gates, auto-review, and a real-time dashboard.

---

## What This Command Does

1. **Parse** - Extract file manifest from DESIGN and identify independent work groups
2. **Plan Mode** - Spawn each work group subagent in plan-only mode; review and approve plans
3. **Execute** - Approved subagents implement in isolated worktrees concurrently
4. **Merge** - Merge worktrees to main branch (report conflicts, never auto-merge)
5. **Verify** - Run ruff + pytest with incremental cache
6. **Report** - Generate BUILD_REPORT with didactic explanations per file
7. **Auto-Review** - code-reviewer runs automatically, generates REVIEW_REPORT
8. **Dashboard** - DASHBOARD updated after each step

---

## Process

### Step 1: Load Context

```markdown
Read(.claude/sdd/features/DESIGN_{FEATURE}.md)
Read(.claude/sdd/features/DEFINE_{FEATURE}.md)
Initialize DASHBOARD_{FEATURE}.md → status: PARSING
```

### Step 2: Identify Work Groups

Parse file manifest and extract independent work groups:

```text
Rule: Files in different groups must have ZERO cross-dependencies.
If file A depends on file B, both must be in the SAME work group.

Example manifest:
  File 1: config.py  (no deps) → Group A
  File 2: utils.py   (no deps) → Group A
  File 3: handler.py (deps: 1, 2) → Group A (same chain)
  File 4: api.py     (no deps) → Group B
  File 5: test_api.py (dep: 4)  → Group B (same chain)

Result: Group A [1,2,3] runs parallel to Group B [4,5]
```

Update DASHBOARD → status: PLANNING

### Step 3: Plan Mode (Quality Gate)

For each work group, spawn subagent in plan-only mode:

```text
Subagent generates:
  - Order of file creation
  - Key decisions per file
  - How patterns from DESIGN will be applied
  - Verification commands to run

Leader reviews plan:
  - Approve → subagent implements
  - Reject with feedback → subagent revises (max 3 attempts)
  - After 3 rejections → leader implements directly
```

### Step 4: Parallel Execution

Approved subagents implement concurrently in isolated worktrees:

```text
Each subagent:
  - Works in isolated git worktree (no file conflicts)
  - Follows DESIGN patterns exactly
  - Provides didactic explanation per file (what/why/how)
  - Runs ruff check after each file
```

Update DASHBOARD → status: EXECUTING (with per-group progress)

### Step 5: Merge Worktrees

```bash
# Leader merges each worktree to main branch
git merge worktree/{group_A}
git merge worktree/{group_B}
# ...
```

**If conflict detected:** Report to user with diff. Do NOT auto-merge. Wait for resolution.

Update DASHBOARD → status: MERGING

### Step 6: Incremental Verification

```bash
# Cache: identify changed files
CHANGED=$(git diff --name-only HEAD~1)

# Incremental check
ruff check $CHANGED

# Full verification (safety net)
ruff check .
pytest
```

Update DASHBOARD → status: VERIFYING

### Step 7: Generate BUILD_REPORT

```markdown
Write(.claude/sdd/reports/BUILD_REPORT_{FEATURE}.md)

For each file, include didactic section:
  - What: purpose in one sentence
  - Why: technical decision rationale
  - How: internal mechanism explanation
```

### Step 8: Auto-Review

code-reviewer runs automatically:

```markdown
Generates: .claude/sdd/reports/REVIEW_REPORT_{FEATURE}.md
Saves patterns to: project memory (persistent across sessions)
```

Update DASHBOARD → status: REVIEWING, then COMPLETE

---

## Docker AFK Mode

Use `--docker` flag for autonomous execution without supervision:

```bash
/build .claude/sdd/features/DESIGN_FEATURE.md --docker
```

- Each worktree runs in isolated Docker container
- Resource limits: 1 CPU core, 2GB RAM
- Prevents agent from accessing system files outside repo
- If Docker not installed: runs without sandbox with warning

---

## Output

| Artifact | Location |
|----------|----------|
| **Code** | As specified in DESIGN file manifest |
| **BUILD_REPORT** | `.claude/sdd/reports/BUILD_REPORT_{FEATURE}.md` |
| **REVIEW_REPORT** | `.claude/sdd/reports/REVIEW_REPORT_{FEATURE}.md` |
| **DASHBOARD** | `.claude/sdd/reports/DASHBOARD_{FEATURE}.md` |

---

## Contextual Guidance

At end of phase, build-agent shows:

```text
---
Concluded: /build .claude/sdd/features/DESIGN_{FEATURE}.md

Artifacts generated:
  - BUILD_REPORT: .claude/sdd/reports/BUILD_REPORT_{FEATURE}.md
  - REVIEW_REPORT: .claude/sdd/reports/REVIEW_REPORT_{FEATURE}.md
  - DASHBOARD: .claude/sdd/reports/DASHBOARD_{FEATURE}.md
  - Code files: {list from manifest}

Next step: /ship .claude/sdd/features/DEFINE_{FEATURE}.md
---
```

---

## Error Handling

| Issue | Action |
|-------|--------|
| Subagent fails in worktree | Resume once; if fails again, implement directly |
| Merge conflict | Report diff to user; wait for resolution |
| Plan rejected 3 times | Leader implements work group directly |
| Docker not available | Warn user, continue without sandbox |
| Missing requirement | Use `/iterate` to update DEFINE |
| Architecture problem | Use `/iterate` to update DESIGN |

---

## References

- Agent: `.claude/agents/workflow/build-agent.md`
- Template: `.claude/sdd/templates/BUILD_REPORT_TEMPLATE.md`
- Dashboard Template: `.claude/sdd/templates/DASHBOARD_TEMPLATE.md`
- Review Template: `.claude/sdd/templates/REVIEW_REPORT_TEMPLATE.md`
- Contracts: `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml`
- Next Phase: `.claude/commands/workflow/ship.md`
