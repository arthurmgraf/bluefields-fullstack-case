# /end-session Command

> Capture and persist a structured session summary before closing the conversation.
> Run this before closing Claude Code to preserve context for the next session.

## Usage

```bash
/end-session
/end-session "tag opcional para identificar o tema"
```

---

## What This Command Does

Writes a structured session summary to `.claude/sessions/` so the next session can
pick up exactly where this one left off — even across days or team members.

---

## Process

### Step 1: Collect Session Data

Gather from the current conversation:

- **Date/time**: current timestamp
- **Duration**: first message to now (estimate)
- **Session tag**: from argument, or infer from main topic
- **Accomplished**: what was built, fixed, or decided
- **Files modified**: list of files created/edited/deleted this session
- **Key decisions**: architectural choices, tradeoffs, rationale
- **Problems solved**: bugs fixed, errors resolved
- **Next steps**: what to do in the next session (be specific — include commands)
- **Commands to resume**: exact commands or file paths to continue work

### Step 2: Determine Filename

Use the naming convention: `{YYYY-MM-DD}_{HH-MM}_session_{tag}.md`

Examples:
- `2026-02-25_14-30_session_codemap-setup.md`
- `2026-02-25_16-00_session_end-session-impl.md`
- `2026-02-25_10-15_session_ci-pipeline-fix.md`

### Step 3: Write the File

```
Write(.claude/sessions/{filename})
```

Use the template below.

### Step 4: Confirm

Output the file path and a one-line summary of what was captured.

---

## Session Summary Template

```markdown
# Session: {tag}
**Date:** {YYYY-MM-DD HH:MM}
**Branch:** {git branch if applicable}

## O que foi feito

- {bullet point: task accomplisehd}
- {bullet point: task accomplished}

## Arquivos modificados

| Arquivo | Ação |
|---------|------|
| `path/to/file.md` | Criado |
| `path/to/file.py` | Modificado |
| `path/to/old.md`  | Removido |

## Decisões tomadas

- **{Decision}**: {rationale — why this approach was chosen}
- **{Decision}**: {rationale}

## Problemas resolvidos

- {bug or issue} → {how it was fixed}

## Próximos passos

- [ ] {specific task to do next}
- [ ] {specific task}
- [ ] {specific task}

## Comandos para retomar

\`\`\`bash
# Para continuar de onde paramos:
{exact command or file path to resume}
\`\`\`

## Contexto importante

{anything that would be confusing without this session's context — e.g. why a file
was structured a certain way, what was tried and didn't work, pending decisions}
```

---

## Output

| Artifact | Location |
|----------|----------|
| **Session summary** | `.claude/sessions/{YYYY-MM-DD}_{HH-MM}_session_{tag}.md` |
| **Activity log** | `.claude/sessions/.activity-log` (auto, Stop hook) |

---

## Notes

- Session files are **not committed** (`.gitignore` excludes them)
- They persist on your local machine across conversations
- For team sharing: use `/memory` (MCP knowledge graph, shared) instead
- Run `/end-session` before closing the tab — not after
- The Stop hook logs minimal metadata automatically; this command writes full content
