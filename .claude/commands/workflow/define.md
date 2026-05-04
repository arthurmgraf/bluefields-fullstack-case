# Define Command

> Capture requirements and validate them in one pass (Phase 1)

## Usage

```bash
/define <input>
```

## Examples

```bash
# From a BRAINSTORM document (recommended after /brainstorm)
/define .claude/sdd/features/BRAINSTORM_INVOICE_PROCESSING.md

# From meeting notes or raw input
/define notes/meeting-notes.md
/define "Build Cloud Run functions for invoice processing"
/define docs/stakeholder-email.txt
```

---

## Overview

This is **Phase 1** of the 5-phase AgentSpec workflow:

```text
Phase 0: /brainstorm → .claude/sdd/features/BRAINSTORM_{FEATURE}.md (optional)
Phase 1: /define     → .claude/sdd/features/DEFINE_{FEATURE}.md (THIS COMMAND)
Phase 2: /design     → .claude/sdd/features/DESIGN_{FEATURE}.md
Phase 3: /build      → Code + BUILD_REPORT + REVIEW_REPORT + DASHBOARD
Phase 4: /ship       → .claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md
```

The `/define` command combines what used to be Intake + PRD + Refine into a single, iterative phase. When fed a BRAINSTORM document, it extracts pre-validated requirements with minimal clarification needed.

---

## What This Command Does

1. **Extract** - Pull requirements from any input (notes, emails, conversations)
2. **Structure** - Organize into problem, users, goals, success criteria
3. **Validate** - Built-in clarity scoring (must reach 12/15 to proceed)
4. **Clarify** - Ask targeted questions for any gaps

---

## Process

### Step 1: Load Context

```markdown
Read(.claude/sdd/templates/DEFINE_TEMPLATE.md)
Read(.claude/CLAUDE.md)

# If file provided:
Read(<input-file>)
```

### Step 2: Classify Input

Identify the input type to guide extraction:

| Input Type | Pattern | Focus |
|------------|---------|-------|
| `brainstorm_document` | BRAINSTORM_*.md from /brainstorm | Pre-validated, extract directly |
| `meeting_notes` | Bullet points, action items | Decisions, requirements |
| `email_thread` | Re:, Fwd:, signatures | Requests, constraints |
| `conversation` | Informal language | Core problem, users |
| `direct_requirement` | Structured request | All elements present |

### Step 3: Extract Entities

Extract these elements from input:

| Element | Extraction Patterns |
|---------|---------------------|
| **Problem** | "We're struggling with...", "The issue is..." |
| **Users** | "For the team...", "Customers want..." |
| **Goals** | "We need to...", "Must have..." |
| **Success Criteria** | "Success means...", "Measured by..." |
| **Acceptance Tests** | "Given/When/Then", "Scenario:" |
| **Constraints** | "Must work with...", "Limited by..." |
| **Out of Scope** | "Not including...", "Excluded:" |

### Step 4: Calculate Clarity Score

Score each element (0-3 points):

| Element | Score | Meaning |
|---------|-------|---------|
| Problem | 0-3 | Clear, specific, actionable |
| Users | 0-3 | Identified with pain points |
| Goals | 0-3 | Measurable outcomes |
| Success | 0-3 | Testable criteria |
| Scope | 0-3 | Explicit boundaries |

**Minimum to proceed:** 12/15 (80%)

### Step 5: Fill Gaps (if needed)

If score < 12, ask targeted clarifying questions (one at a time).

### Step 6: Generate Document

```markdown
Write(.claude/sdd/features/DEFINE_{FEATURE_NAME}.md)
```

### Step 7: Contextual Guidance

Show at end:

```text
---
Concluded: /define {input}

Artifacts generated:
  - DEFINE: .claude/sdd/features/DEFINE_{FEATURE}.md

Next step: /design .claude/sdd/features/DEFINE_{FEATURE}.md
---
```

---

## Output

| Artifact | Location |
|----------|----------|
| **DEFINE** | `.claude/sdd/features/DEFINE_{FEATURE_NAME}.md` |

---

## Quality Gate

Before saving, verify:

```text
[ ] Problem statement is clear and specific
[ ] At least one user persona identified
[ ] Success criteria are measurable
[ ] Acceptance tests are testable
[ ] Out of scope is explicit
[ ] Clarity Score >= 12/15
[ ] Contextual guidance shown
```

---

## References

- Agent: `.claude/agents/workflow/define-agent.md`
- Template: `.claude/sdd/templates/DEFINE_TEMPLATE.md`
- Contracts: `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml`
- Previous Phase: `.claude/commands/workflow/brainstorm.md` (optional)
- Next Phase: `.claude/commands/workflow/design.md`
