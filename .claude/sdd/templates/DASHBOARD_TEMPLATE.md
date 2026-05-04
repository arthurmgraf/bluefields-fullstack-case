# DASHBOARD: {FEATURE_NAME}

> Real-time progress tracking for parallel /build execution.

**Last Updated:** {YYYY-MM-DD HH:MM}
**Pipeline Status:** {PARSING | PLANNING | EXECUTING | MERGING | VERIFYING | REVIEWING | COMPLETE}

---

## Work Groups

| Group | Description | Agent | Status | Files Done | Verification |
|-------|-------------|-------|--------|------------|--------------|
| A | {Description} | @{agent-name} | Waiting | 0/{N} | - |
| B | {Description} | @{agent-name} | Waiting | 0/{N} | - |
| C | {Description} | @{agent-name} | Waiting | 0/{N} | - |

**Status Legend:**
- `Waiting` — Not started yet
- `Planning` — Subagent generating plan (Plan Mode)
- `Approved` — Plan approved, ready to execute
- `Executing` — Implementation in progress
- `Done` — Files written, awaiting merge
- `Merged` — Successfully merged to main branch
- `Verified` — Passed ruff + pytest
- `Blocked` — Issue encountered, needs attention

---

## Timeline

| Step | Started | Completed | Duration |
|------|---------|-----------|----------|
| Parse manifest | {HH:MM} | {HH:MM} | {<1min} |
| Plan Mode review | {HH:MM} | {HH:MM} | {Xmin} |
| Parallel execution | {HH:MM} | {HH:MM} | {Xmin} |
| Merge worktrees | {HH:MM} | {HH:MM} | {Xmin} |
| Verification (ruff + pytest) | {HH:MM} | {HH:MM} | {Xmin} |
| Auto-review | {HH:MM} | {HH:MM} | {Xmin} |

---

## File Progress

| File | Work Group | Agent | Status | Verified |
|------|------------|-------|--------|----------|
| `{path/to/file1.py}` | A | @{agent-name} | Pending | - |
| `{path/to/file2.py}` | B | @{agent-name} | Pending | - |
| `{path/to/config.yaml}` | A | (direct) | Pending | - |

---

## Plan Mode Review

| Work Group | Plan Status | Issues | Revision # |
|------------|-------------|--------|------------|
| A | Pending | - | - |
| B | Pending | - | - |
| C | Pending | - | - |

**Plan States:** `Pending` | `Submitted` | `Approved` | `Rejected (revision N)` | `Auto-approved`

---

## Issues

| # | Issue | Work Group | Severity | Resolution |
|---|-------|------------|----------|------------|
| (none) | | | | |

---

## Merge Status

| Work Group | Branch | Merge Status | Conflicts |
|------------|--------|--------------|-----------|
| A | `worktree/feature-a` | Pending | - |
| B | `worktree/feature-b` | Pending | - |
| C | `worktree/feature-c` | Pending | - |

---

## Final Verification

| Check | Scope | Status | Output |
|-------|-------|--------|--------|
| `ruff check` | All modified files | Pending | - |
| `mypy` | All modified files | Pending | - |
| `pytest` | Full test suite | Pending | - |

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Files** | {N} |
| **Files Complete** | {N}/{N} |
| **Work Groups Complete** | {N}/{N} |
| **Verification** | Pending / Pass / Fail |
| **Auto-review** | Pending / Complete |
| **Overall Status** | {IN_PROGRESS / COMPLETE / BLOCKED} |

---

*Dashboard auto-updated by build-agent after each step.*
*See full report: [BUILD_REPORT_{FEATURE}.md](./BUILD_REPORT_{FEATURE}.md)*
