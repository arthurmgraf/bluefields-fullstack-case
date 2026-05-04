# Design Command

> Create architecture and technical specification with parallel background research (Phase 2)

## Usage

```bash
/design <define-file>
```

## Examples

```bash
/design .claude/sdd/features/DEFINE_CLOUD_RUN_FUNCTIONS.md
/design DEFINE_USER_AUTH.md
/design .claude/sdd/features/DEFINE_INVOICE_EXTRACTION.md
```

---

## Overview

This is **Phase 2** of the 5-phase AgentSpec workflow:

```text
Phase 0: /brainstorm → .claude/sdd/features/BRAINSTORM_{FEATURE}.md (optional)
Phase 1: /define     → .claude/sdd/features/DEFINE_{FEATURE}.md
Phase 2: /design     → .claude/sdd/features/DESIGN_{FEATURE}.md (THIS COMMAND)
Phase 3: /build      → Code + BUILD_REPORT + REVIEW_REPORT + DASHBOARD
Phase 4: /ship       → .claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md
```

The `/design` command combines architecture design, inline ADRs, and file manifest creation. In AgentSpec 5.0, it spawns background subagents to research the codebase and KB domains in parallel before synthesizing the DESIGN document.

---

## What This Command Does

1. **Research** - Spawn background subagents to explore codebase and KB domains in parallel
2. **Synthesize** - Aggregate findings from all researchers
3. **Architect** - Design high-level solution with diagrams
4. **Decide** - Document key decisions with rationale (inline ADRs)
5. **Partition** - Divide file manifest into independent work groups for parallel build
6. **Specify** - Create file manifest and code patterns
7. **Plan Testing** - Define testing strategy

---

## Process

### Step 1: Load Context

```markdown
Read(.claude/sdd/features/DEFINE_{FEATURE}.md)
Read(.claude/sdd/templates/DESIGN_TEMPLATE.md)
Read(.claude/CLAUDE.md)
```

### Step 2: Parallel Background Research

Two background subagents launch concurrently:

```text
Subagent A (background):
  Task: "Search existing codebase for patterns relevant to {feature}"
  Finds: conventions, integration points, existing similar code

Subagent B (background):
  Task: "Search KB domains {from DEFINE technical context}"
  Finds: best practices, anti-patterns, relevant code snippets

Leader awaits both → synthesizes findings → informs architecture decisions
```

### Step 3: Create Architecture

Design the solution:

| Component | Content |
|-----------|---------|
| **Overview** | ASCII diagram of system |
| **Components** | List of modules/services |
| **Data Flow** | How data moves through system |
| **Integration Points** | External dependencies |

### Step 4: Document Decisions (Inline ADRs)

For each significant choice:

```markdown
### Decision: {Name}

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | YYYY-MM-DD |

**Context:** Why this decision was needed

**Choice:** What we're doing

**Rationale:** Why this approach (informed by research)

**Alternatives Rejected:**
1. Option A - rejected because X
2. Option B - rejected because Y

**Consequences:**
- Trade-off we accept
- Benefit we gain
```

### Step 5: Create File Manifest with Work Groups

List all files and partition into independent work groups:

| # | File | Action | Purpose | Agent | Work Group | Dependencies |
|---|------|--------|---------|-------|------------|--------------|
| 1 | `path/config.py` | Create | Configuration | @python-developer | A | None |
| 2 | `path/utils.py` | Create | Utilities | @python-developer | A | None |
| 3 | `path/handler.py` | Create | Main handler | @python-developer | A | 1, 2 |
| 4 | `path/api.py` | Create | API layer | @python-developer | B | None |

**Work Group Rule:** Files in different groups must have ZERO cross-dependencies.

### Step 6: Define Code Patterns

Provide copy-paste ready code snippets for key patterns.

### Step 7: Plan Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Functions | pytest |
| Integration | API | pytest + requests |
| E2E | Full flow | Manual/automated |

### Step 8: Save and Show Contextual Guidance

```markdown
Write(.claude/sdd/features/DESIGN_{FEATURE_NAME}.md)
```

Show at end:

```text
---
Concluded: /design .claude/sdd/features/DEFINE_{FEATURE}.md

Artifacts generated:
  - DESIGN: .claude/sdd/features/DESIGN_{FEATURE}.md

Next step: /build .claude/sdd/features/DESIGN_{FEATURE}.md
---
```

---

## Output

| Artifact | Location |
|----------|----------|
| **DESIGN** | `.claude/sdd/features/DESIGN_{FEATURE_NAME}.md` |

---

## Quality Gate

Before saving, verify:

```text
[ ] Architecture diagram is clear
[ ] Background research completed and synthesized
[ ] All major decisions documented with rationale
[ ] File manifest complete with Work Group column
[ ] Work groups are independent (no cross-group deps)
[ ] Code patterns are copy-paste ready
[ ] Testing strategy covers requirements
[ ] No circular dependencies in architecture
```

---

## References

- Agent: `.claude/agents/workflow/design-agent.md`
- Template: `.claude/sdd/templates/DESIGN_TEMPLATE.md`
- Contracts: `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml`
- Next Phase: `.claude/commands/workflow/build.md`
