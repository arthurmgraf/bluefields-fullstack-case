# Iterate Command

> Update any phase document when requirements or design changes (Cross-Phase)

## Usage

```bash
/iterate <file> "<change-description>"
```

## Examples

```bash
/iterate BRAINSTORM_CLOUD_RUN.md "Consider batch processing instead of real-time"
/iterate DEFINE_CLOUD_RUN.md "Add support for PDF invoices, not just TIFF"
/iterate DESIGN_CLOUD_RUN.md "Functions need to be self-contained, no shared common/"
/iterate .claude/sdd/features/DEFINE_AUTH.md "Change from JWT to session-based auth"
```

---

## Overview

The `/iterate` command works with **document phases** of the AgentSpec workflow:

```text
Phase 0: /brainstorm → BRAINSTORM_{FEATURE}.md <- /iterate can update
Phase 1: /define     → DEFINE_{FEATURE}.md     <- /iterate can update
Phase 2: /design     → DESIGN_{FEATURE}.md     <- /iterate can update
Phase 3: /build      → (code)                  <- Update DESIGN, then /build
Phase 4: /ship       → (archive)               <- N/A
```

Use `/iterate` when you discover something that needs to change mid-stream.

**Important:** To change code during Phase 3, update the DESIGN document first. The cascade to code triggers a rebuild via `/build`.

---

## What This Command Does

1. **Detect Phase** - Identify which phase document is being updated
2. **Analyze Impact** - Determine downstream effects
3. **Update Document** - Apply changes with version tracking
4. **Cascade** - Propagate changes to downstream documents if needed

---

## Process

### Step 1: Load Target Document

```markdown
Read(<target-file>)

# Identify document type:
# - BRAINSTORM_*.md → Phase 0
# - DEFINE_*.md → Phase 1
# - DESIGN_*.md → Phase 2
```

### Step 2: Analyze Change

Determine the change type:

| Change Type | Example | Impact |
|-------------|---------|--------|
| **Additive** | "Also support PDF" | Low - adds to existing |
| **Modifying** | "Change from X to Y" | Medium - updates existing |
| **Removing** | "Remove feature Z" | Medium - simplifies |
| **Architectural** | "Use different pattern" | High - may require redesign |

### Step 3: Apply Changes

Update the document with:

1. The actual modification
2. Version bump in revision history
3. Change note explaining what and why

### Step 4: Assess Cascade Need

| Source | Cascades To |
|--------|-------------|
| DEFINE change | May need DESIGN update |
| DESIGN change | May need code update (via /build) |
| DESIGN work group change | May need re-partitioning |

### Step 5: Execute Cascade (if needed)

If cascade needed, prompt user:

```markdown
"This {DOCUMENT} change affects {DOWNSTREAM}. Options:
(a) Update downstream automatically to match
(b) Just update this document, I'll handle downstream manually
(c) Show me what would change first"
```

### Step 6: Save Updates and Show Contextual Guidance

```markdown
Write(<target-file>)
# If cascade:
Write(<downstream-document>)
```

Show at end:

```text
---
Concluded: /iterate {target-file} "{change}"

Documents updated:
  - {DOCUMENT_TYPE}: {full_path}
  - {DOWNSTREAM_TYPE}: {full_path}  (if cascade)

Next step: /{relevant_phase} {path}
---
```

---

## Output

| Artifact | Location |
|----------|----------|
| **Updated Document** | Same location as input |
| **Cascade Updates** | Downstream documents (if applicable) |

---

## Version Tracking

Each document maintains revision history:

```markdown
## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-25 | define-agent | Initial version |
| 1.1 | 2026-01-25 | iterate-agent | Added PDF support per user request |
```

---

## When to Use /iterate vs Starting Over

| Situation | Action |
|-----------|--------|
| < 30% change | `/iterate` |
| Add/modify features | `/iterate` |
| Change constraints | `/iterate` |
| > 50% different | New `/define` |
| Different problem entirely | New `/define` |
| Different target users | New `/define` |

---

## References

- Agent: `.claude/agents/workflow/iterate-agent.md`
- Contracts: `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml`
