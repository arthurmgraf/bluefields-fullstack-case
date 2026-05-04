# BUILD REPORT: {Feature Name}

> Implementation report for {Feature Name}

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | {FEATURE_NAME} |
| **Date** | {YYYY-MM-DD} |
| **Author** | build-agent |
| **DEFINE** | [DEFINE_{FEATURE}.md](../features/DEFINE_{FEATURE}.md) |
| **DESIGN** | [DESIGN_{FEATURE}.md](../features/DESIGN_{FEATURE}.md) |
| **Dashboard** | [DASHBOARD_{FEATURE}.md](./DASHBOARD_{FEATURE}.md) |
| **Review** | [REVIEW_REPORT_{FEATURE}.md](./REVIEW_REPORT_{FEATURE}.md) |
| **Status** | In Progress / Complete / Blocked |

---

## Summary

| Metric | Value |
|--------|-------|
| **Tasks Completed** | {X}/{Y} |
| **Work Groups** | {N} |
| **Files Created** | {N} |
| **Lines of Code** | {N} |
| **Build Time** | {Duration} |
| **Tests Passing** | {X}/{Y} |
| **Agents Used** | {N} |

---

## Work Group Execution

| Group | Files | Agent | Status | Duration |
|-------|-------|-------|--------|----------|
| A: {Description} | {N} | @{agent-name} | Complete | {Xm} |
| B: {Description} | {N} | @{agent-name} | Complete | {Xm} |
| C: {Description} | {N} | (direct) | Complete | {Xm} |

---

## Task Execution with Agent Attribution

| # | Task | Work Group | Agent | Status | Duration | Notes |
|---|------|------------|-------|--------|----------|-------|
| 1 | {Task description} | {A/B/C} | @{agent-name} | Complete | {Xm} | {Any notes} |
| 2 | {Task description} | {A/B/C} | @{agent-name} | Complete | {Xm} | {Any notes} |
| 3 | {Task description} | {A/B/C} | (direct) | In Progress | - | {No specialist matched} |
| 4 | {Task description} | {A/B/C} | @{agent-name} | Pending | - | - |

**Legend:** Complete | In Progress | Pending | Blocked

**Agent Key:**
- `@{agent-name}` = Delegated to specialist agent via Task tool
- `(direct)` = Built directly by build-agent (no specialist matched)

---

## Files Created

| File | Work Group | Lines | Agent | Verified | Notes |
| ---- | ---------- | ----- | ----- | -------- | ----- |
| `{path/to/file1.py}` | A | {N} | @{agent-name} | Pass | {Any notes} |
| `{path/to/file2.py}` | B | {N} | @{agent-name} | Pass | {Any notes} |
| `{path/to/config.yaml}` | A | {N} | (direct) | Pass | {Any notes} |

---

## Didactic Explanations

> What was built, why each decision was made, and how each component works.

### {path/to/file1.py}

**What:** {1-2 sentences describing what this file does}

**Why:** {Technical decision — why this approach was chosen over alternatives}

**How:** {Explanation of how it works — key logic, patterns used, integration points}

---

### {path/to/file2.py}

**What:** {1-2 sentences describing what this file does}

**Why:** {Technical decision — why this approach was chosen over alternatives}

**How:** {Explanation of how it works — key logic, patterns used, integration points}

---

### {path/to/config.yaml}

**What:** {1-2 sentences describing what this file does}

**Why:** {Technical decision — why this approach was chosen over alternatives}

**How:** {Explanation of how it works — key logic, patterns used, integration points}

---

## Agent Contributions

| Agent | Work Group | Files | Specialization Applied |
|-------|------------|-------|------------------------|
| @{agent-1} | A | {N} | {What patterns/KB used} |
| @{agent-2} | B | {N} | {What patterns/KB used} |
| (direct) | A | {N} | DESIGN patterns only |

---

## Verification Results

### Incremental Lint (ruff)

> Only files modified since last verification were re-checked (cache: `git diff --name-only`).

```text
{Output from ruff check or "All checks passed"}
```

**Status:** Pass / Fail

### Type Check (mypy)

```text
{Output from mypy or "All checks passed" or "N/A - not configured"}
```

**Status:** Pass / Fail / Skipped

### Tests (pytest)

```text
{Output from pytest or summary}
```

| Test | Result |
|------|--------|
| `test_function_1` | Pass |
| `test_function_2` | Pass |
| `test_integration` | Pass |

**Status:** {X}/{Y} Pass | {N} Fail

---

## Issues Encountered

| # | Issue | Work Group | Resolution | Time Impact |
|---|-------|------------|------------|-------------|
| 1 | {Description of issue} | {A/B/C} | {How it was resolved} | {+Xm} |
| 2 | {Description of issue} | {A/B/C} | {How it was resolved} | {+Xm} |

---

## Deviations from Design

| Deviation | Work Group | Reason | Impact |
|-----------|------------|--------|--------|
| {What changed from DESIGN} | {A/B/C} | {Why it changed} | {Effect on system} |

---

## Blockers (if any)

| Blocker | Work Group | Required Action | Owner |
|---------|------------|-----------------|-------|
| {Description} | {A/B/C} | {What needs to happen} | {Who can unblock} |

---

## Acceptance Test Verification

| ID | Scenario | Status | Evidence |
|----|----------|--------|----------|
| AT-001 | {From DEFINE} | Pass / Fail | {How verified} |
| AT-002 | {From DEFINE} | Pass / Fail | {How verified} |
| AT-003 | {From DEFINE} | Pass / Fail | {How verified} |

---

## Performance Notes

| Metric | Expected | Actual | Status |
|--------|----------|--------|--------|
| {Metric 1} | {From DEFINE} | {Measured} | Pass / Fail |
| {Metric 2} | {From DEFINE} | {Measured} | Pass / Fail |

---

## Final Status

### Overall: {COMPLETE / IN PROGRESS / BLOCKED}

**Completion Checklist:**

- [ ] All tasks from manifest completed
- [ ] All work groups merged without conflicts
- [ ] All verification checks pass (incremental + final)
- [ ] All tests pass
- [ ] No blocking issues
- [ ] Acceptance tests verified
- [ ] Didactic explanations written for all files
- [ ] DASHBOARD updated to COMPLETE status
- [ ] Auto-review completed (REVIEW_REPORT generated)
- [ ] Ready for /ship

---

## Next Step

**If Complete:** `/ship .claude/sdd/features/DEFINE_{FEATURE_NAME}.md`

**If Blocked:** Resolve blockers, then `/build` to resume

**If Issues Found:** `/iterate DESIGN_{FEATURE}.md "{change needed}"`
