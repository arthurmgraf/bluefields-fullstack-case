# Ship Command

> Archive completed feature with auto-diagrams, history index, and lessons learned (Phase 4)

## Usage

```bash
/ship <define-file>
```

## Examples

```bash
/ship .claude/sdd/features/DEFINE_CLOUD_RUN_FUNCTIONS.md
/ship DEFINE_USER_AUTH.md
```

---

## Overview

This is **Phase 4** of the 5-phase AgentSpec workflow:

```text
Phase 0: /brainstorm → .claude/sdd/features/BRAINSTORM_{FEATURE}.md (optional)
Phase 1: /define     → .claude/sdd/features/DEFINE_{FEATURE}.md
Phase 2: /design     → .claude/sdd/features/DESIGN_{FEATURE}.md
Phase 3: /build      → Code + BUILD_REPORT + REVIEW_REPORT + DASHBOARD
Phase 4: /ship       → .claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md (THIS COMMAND)
```

The `/ship` command archives all feature artifacts, triggers /generate-diagrams automatically if needed, creates a chronological HISTORY index, and captures lessons learned.

---

## What This Command Does

1. **Verify** - Confirm all artifacts exist and build passed
2. **Auto-Diagrams** - Trigger /generate-diagrams if not already run
3. **Archive** - Move feature documents to archive folder
4. **History** - Create HISTORY_{FEATURE}.md with timestamps for all artifacts
5. **Document** - Create SHIPPED summary with lessons learned
6. **Clean** - Remove working files from features and reports folders

---

## Process

### Step 1: Verify Completion

```markdown
Read(.claude/sdd/features/DEFINE_{FEATURE}.md)
Read(.claude/sdd/features/DESIGN_{FEATURE}.md)
Read(.claude/sdd/reports/BUILD_REPORT_{FEATURE}.md)

# Preferred artifacts (warn if missing, don't block):
Read(.claude/sdd/reports/REVIEW_REPORT_{FEATURE}.md)
Read(.claude/sdd/reports/DASHBOARD_{FEATURE}.md)

# Verify build report shows success
```

### Step 2: Trigger Auto-Diagrams

If architecture diagrams have not been generated:

```text
Invoke: /generate-diagrams
Output: diagrams/{FEATURE}/architecture.excalidraw
```

If diagrams already exist, skip this step.

### Step 3: Create Archive Folder

```bash
mkdir -p .claude/sdd/archive/{FEATURE_NAME}/
```

### Step 4: Copy Artifacts to Archive

```bash
# Required artifacts
cp .claude/sdd/features/DEFINE_{FEATURE}.md .claude/sdd/archive/{FEATURE}/
cp .claude/sdd/features/DESIGN_{FEATURE}.md .claude/sdd/archive/{FEATURE}/
cp .claude/sdd/reports/BUILD_REPORT_{FEATURE}.md .claude/sdd/archive/{FEATURE}/

# Optional artifacts (if they exist)
cp .claude/sdd/features/BRAINSTORM_{FEATURE}.md .claude/sdd/archive/{FEATURE}/
cp .claude/sdd/reports/REVIEW_REPORT_{FEATURE}.md .claude/sdd/archive/{FEATURE}/
cp .claude/sdd/reports/DASHBOARD_{FEATURE}.md .claude/sdd/archive/{FEATURE}/
```

### Step 5: Create HISTORY Index

```markdown
Write(.claude/sdd/archive/{FEATURE}/HISTORY_{FEATURE}.md)

Chronological record of all artifacts with:
  - Artifact name
  - Creation timestamp
  - Phase number
  - Final status
```

### Step 6: Generate SHIPPED Document

Create summary with:

| Section | Content |
|---------|---------|
| **Summary** | What was built |
| **Timeline** | Start → Ship dates |
| **Metrics** | Lines of code, files created, work groups used |
| **Review Summary** | Critical issues from REVIEW_REPORT (if any) |
| **Lessons Learned** | What went well, what to improve |
| **Artifacts** | List of all archived documents |

### Step 7: Update Document Statuses

```markdown
Edit: archive/{FEATURE}/DEFINE_{FEATURE}.md
  - Status: → "Shipped"
  - Add revision: "Shipped and archived"

Edit: archive/{FEATURE}/DESIGN_{FEATURE}.md
  - Status: → "Shipped"
  - Add revision: "Shipped and archived"
```

### Step 8: Clean Up Working Files

```bash
rm -f .claude/sdd/features/BRAINSTORM_{FEATURE}.md
rm -f .claude/sdd/features/DEFINE_{FEATURE}.md
rm -f .claude/sdd/features/DESIGN_{FEATURE}.md
rm -f .claude/sdd/reports/BUILD_REPORT_{FEATURE}.md
rm -f .claude/sdd/reports/REVIEW_REPORT_{FEATURE}.md
rm -f .claude/sdd/reports/DASHBOARD_{FEATURE}.md
```

### Step 9: Save SHIPPED Document

```markdown
Write(.claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md)
```

### Step 10: Contextual Guidance

```text
---
Concluded: /ship .claude/sdd/features/DEFINE_{FEATURE}.md

Artifacts archived:
  - SHIPPED: .claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md
  - HISTORY: .claude/sdd/archive/{FEATURE}/HISTORY_{FEATURE}.md
  - Archive: .claude/sdd/archive/{FEATURE}/

Next step: (none - feature complete)
Start new feature: /brainstorm "your new idea"
---
```

---

## Output

| Artifact | Location |
|----------|----------|
| **SHIPPED** | `.claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md` |
| **HISTORY** | `.claude/sdd/archive/{FEATURE}/HISTORY_{FEATURE}.md` |
| **DEFINE** | `.claude/sdd/archive/{FEATURE}/DEFINE_{FEATURE}.md` |
| **DESIGN** | `.claude/sdd/archive/{FEATURE}/DESIGN_{FEATURE}.md` |
| **BUILD_REPORT** | `.claude/sdd/archive/{FEATURE}/BUILD_REPORT_{FEATURE}.md` |

---

## Quality Gate

Before shipping, verify:

```text
[ ] BUILD_REPORT shows all tasks completed
[ ] No critical issues in build report
[ ] All tests passing
[ ] REVIEW_REPORT exists (even if zero issues)
[ ] Diagrams generated (auto or manual)
[ ] HISTORY index created
```

---

## References

- Agent: `.claude/agents/workflow/ship-agent.md`
- Template: `.claude/sdd/templates/SHIPPED_TEMPLATE.md`
- History Template: `.claude/sdd/templates/HISTORY_TEMPLATE.md`
- Contracts: `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml`
- Previous Phase: `.claude/commands/workflow/build.md`
