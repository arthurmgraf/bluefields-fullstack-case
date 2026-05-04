# HISTORY: {FEATURE_NAME}

> Chronological index of all artifacts generated during the {FEATURE_NAME} feature lifecycle.
> Created by /ship during archival (Phase 4).

---

## Feature Summary

| Attribute | Value |
|-----------|-------|
| **Feature** | {FEATURE_NAME} |
| **Started** | {YYYY-MM-DD} |
| **Shipped** | {YYYY-MM-DD} |
| **Total Duration** | {N days / N hours} |
| **Phases Completed** | {0/1/2/3/4} |
| **Total Artifacts** | {N} |
| **Archive Location** | `.claude/sdd/archive/{FEATURE_NAME}/` |

---

## Artifact Timeline

| # | Artifact | Phase | Created | Last Updated | Final Status |
|---|----------|-------|---------|--------------|--------------|
| 1 | `BRAINSTORM_{FEATURE}.md` | Phase 0 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Complete (led to DEFINE) |
| 2 | `DEFINE_{FEATURE}.md` | Phase 1 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Complete (led to DESIGN) |
| 3 | `DESIGN_{FEATURE}.md` | Phase 2 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Complete (led to BUILD) |
| 4 | `DASHBOARD_{FEATURE}.md` | Phase 3 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Complete |
| 5 | `BUILD_REPORT_{FEATURE}.md` | Phase 3 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Complete |
| 6 | `REVIEW_REPORT_{FEATURE}.md` | Phase 3.5 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Complete |
| 7 | `SHIPPED_{DATE}.md` | Phase 4 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | Shipped |
| 8 | `HISTORY_{FEATURE}.md` | Phase 4 | {YYYY-MM-DD HH:MM} | {YYYY-MM-DD HH:MM} | This file |

*(Add/remove rows as needed — BRAINSTORM is optional, some features skip Phase 0)*

---

## Iteration Log

> Changes applied via /iterate during the feature lifecycle.

| # | Date | Phase Document | Change Description | Cascade |
|---|------|----------------|--------------------|---------|
| 1 | {YYYY-MM-DD} | {DEFINE/DESIGN} | {What changed} | {Yes/No — what cascaded} |
| 2 | {YYYY-MM-DD} | {DEFINE/DESIGN} | {What changed} | {Yes/No — what cascaded} |

*(Write "No iterations — first-pass implementation" if /iterate was not used)*

---

## Agent Timeline

| Phase | Agent | Role | Duration |
|-------|-------|------|----------|
| Phase 0 | brainstorm-agent | Exploration and approach selection | {Xmin} |
| Phase 1 | define-agent | Requirements capture and validation | {Xmin} |
| Phase 2 | design-agent + {N} background subagents | Architecture + parallel research | {Xmin} |
| Phase 3 | build-agent + {N} work group subagents | Parallel implementation | {Xmin} |
| Phase 3.5 | code-reviewer | Auto-review post-build | {Xmin} |
| Phase 4 | ship-agent | Archival and lessons learned | {Xmin} |

---

## Code Artifacts

> Source files created or significantly modified during this feature.

| File | Action | Phase | Work Group | Lines |
|------|--------|-------|------------|-------|
| `{path/to/file1.py}` | Created | Phase 3 | A | {N} |
| `{path/to/file2.py}` | Modified | Phase 3 | B | {N} |
| `{path/to/test_file.py}` | Created | Phase 3 | C | {N} |

**Total:** {N} files, {N} lines of code

---

## Key Decisions

> Architecture decisions made during this feature. Full details in SHIPPED document.

| # | Decision | Phase | Rationale Summary |
|---|----------|-------|-------------------|
| 1 | {Decision title} | Phase {N} | {1-sentence rationale} |
| 2 | {Decision title} | Phase {N} | {1-sentence rationale} |

---

## Quality Metrics

| Metric | Value |
|--------|-------|
| **Clarity Score (DEFINE)** | {N}/15 |
| **Tests Passing** | {X}/{Y} |
| **Critical Review Issues** | {N} |
| **Warning Review Issues** | {N} |
| **Deviations from DESIGN** | {N} |
| **Build Iterations** | {N} |

---

## Archive Contents

```text
.claude/sdd/archive/{FEATURE_NAME}/
├── HISTORY_{FEATURE}.md          (this file)
├── SHIPPED_{DATE}.md             (lessons learned + summary)
├── BRAINSTORM_{FEATURE}.md       (optional — Phase 0)
├── DEFINE_{FEATURE}.md           (Phase 1 — requirements)
├── DESIGN_{FEATURE}.md           (Phase 2 — architecture)
├── BUILD_REPORT_{FEATURE}.md     (Phase 3 — build execution)
├── REVIEW_REPORT_{FEATURE}.md    (Phase 3.5 — auto-review)
└── DASHBOARD_{FEATURE}.md        (Phase 3 — build progress)
```

---

*History index created by ship-agent during Phase 4 archival.*
*Feature archive: `.claude/sdd/archive/{FEATURE_NAME}/`*
