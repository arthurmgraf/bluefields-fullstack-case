# Brainstorm Command

> Collaborative exploration before requirements capture (Phase 0)

## Usage

```bash
/brainstorm <idea-or-request>
/brainstorm "Build invoice extraction pipeline"
/brainstorm notes/rough-idea.txt
```

## Examples

```bash
# From a direct idea
/brainstorm "I want to automate invoice processing"

# From a file with notes
/brainstorm docs/meeting-notes.md

# From a problem statement
/brainstorm "Our team spends too much time on manual data entry"
```

---

## Overview

This is **Phase 0** of the 5-phase AgentSpec workflow:

```text
Phase 0: /brainstorm → .claude/sdd/features/BRAINSTORM_{FEATURE}.md (THIS COMMAND)
Phase 1: /define     → .claude/sdd/features/DEFINE_{FEATURE}.md
Phase 2: /design     → .claude/sdd/features/DESIGN_{FEATURE}.md
Phase 3: /build      → Code + BUILD_REPORT + REVIEW_REPORT + DASHBOARD
Phase 4: /ship       → .claude/sdd/archive/{FEATURE}/SHIPPED_{DATE}.md
```

The `/brainstorm` command explores ideas through dialogue before capturing formal requirements.

---

## What This Command Does

1. **Explore** - Understand project context and existing patterns
2. **Question** - Ask one question at a time to clarify intent
3. **Collect** - Gather sample files, ground truth, or reference data for LLM grounding
4. **Propose** - Present 2-3 approaches with trade-offs
5. **Simplify** - Apply YAGNI to remove unnecessary features
6. **Validate** - Incrementally confirm understanding
7. **Document** - Generate BRAINSTORM document for /define

---

## Process

### Step 1: Gather Context

```markdown
Read(.claude/CLAUDE.md)
Read(.claude/sdd/templates/BRAINSTORM_TEMPLATE.md)
Explore project structure, recent commits, existing patterns
```

### Step 2: Discovery Questions

Ask questions ONE AT A TIME:

| Question Type | When to Use |
|---------------|-------------|
| Multiple Choice | When options are clear (preferred) |
| Open-Ended | When exploring unknown territory |
| Clarifying | When answer was vague |

**Minimum:** 3 questions before proposing approaches

### Step 3: Sample Collection (LLM Grounding)

Ask about available samples to improve AI/LLM accuracy:

```markdown
"Do you have any samples that could help ground the solution?
(a) Sample input files
(b) Expected output examples
(c) Ground truth / verified data
(d) None available"
```

### Step 4: Explore Approaches

Present 2-3 distinct approaches:

```markdown
### Approach A: {Name} [Recommended]
**Why:** {Reasoning}
**Pros:** {Benefits}
**Cons:** {Trade-offs}

### Approach B: {Name}
**Why not recommended:** {Reasoning}
```

### Step 5: Apply YAGNI

For each feature, ask:
- Do we need this for MVP?
- Does this solve the core problem?

Remove features that don't pass. Document what was removed and why.

### Step 6: Validate Incrementally

Present design in sections (200-300 words each):

```text
Section → Check with user → Adjust if needed → Next section
```

**Minimum:** 2 validation checkpoints

### Step 7: Generate Document

```markdown
Write(.claude/sdd/features/BRAINSTORM_{FEATURE}.md)
```

### Step 8: Contextual Guidance

Show at end:

```text
---
Concluded: /brainstorm {input}

Artifacts generated:
  - BRAINSTORM: .claude/sdd/features/BRAINSTORM_{FEATURE}.md

Next step: /define .claude/sdd/features/BRAINSTORM_{FEATURE}.md
---
```

---

## Output

| Artifact | Location |
|----------|----------|
| **Brainstorm Document** | `.claude/sdd/features/BRAINSTORM_{FEATURE}.md` |

---

## Quality Gate

Before marking complete:

```text
[ ] Minimum 3 discovery questions asked
[ ] Sample collection question asked
[ ] At least 2 approaches explored
[ ] YAGNI applied (features removed)
[ ] Minimum 2 validations completed
[ ] User confirmed selected approach
[ ] Draft requirements included
[ ] Contextual guidance shown
```

---

## When to Use /brainstorm vs /define

| Scenario | Use |
|----------|-----|
| Vague idea, need to explore | `/brainstorm` |
| Clear requirements, ready to capture | `/define` directly |
| Existing BRAINSTORM document | `/define <brainstorm-file>` |
| Meeting notes with clear asks | `/define` directly |
| "I want to build something but not sure what" | `/brainstorm` |

---

## References

- Agent: `.claude/agents/workflow/brainstorm-agent.md`
- Template: `.claude/sdd/templates/BRAINSTORM_TEMPLATE.md`
- Contracts: `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml`
- Next Phase: `.claude/commands/workflow/define.md`
