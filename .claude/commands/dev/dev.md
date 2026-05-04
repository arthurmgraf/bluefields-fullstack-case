# /dev Command

> **Dev Loop** — Agentic Development (Level 2) with structured iteration, intelligent routing, and parallel team execution.

## Usage

```bash
# Craft a new PROMPT (prompt-crafter guides you)
/dev "I want to build a date parser"
/dev "Add caching to the API"

# Execute an existing PROMPT
/dev tasks/PROMPT_DATE_PARSER.md
/dev tasks/PROMPT_CACHE.md --mode afk

# Resume an interrupted session
/dev tasks/PROMPT_CACHE.md --resume

# Validate without executing
/dev tasks/PROMPT_AUTH.md --dry-run

# List available PROMPTs
/dev --list
```

## How It Works

The `/dev` command intelligently routes between two modes:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              /dev COMMAND ROUTING                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   User Input                              Action                                 │
│   ──────────                              ──────                                 │
│                                                                                  │
│   /dev "description"         →  prompt-crafter (ask questions, build PROMPT)    │
│   /dev tasks/PROMPT_*.md     →  dev-loop-executor (execute the PROMPT)          │
│   /dev --list                →  Show available PROMPTs                          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Mode 1: Craft (New Request)

When you provide a description (not a file path), the **prompt-crafter** agent:

1. **Explores** the codebase for context
2. **Asks** targeted questions to clarify requirements
3. **Recommends** team_size based on task count
4. **Generates** a complete PROMPT.md file
5. **Confirms** with you before handoff

```bash
/dev "I want to create a Redis caching layer"
```

---

## Mode 2: Execute (Existing PROMPT)

When you provide a PROMPT file path, the **dev-loop-executor** agent:

1. **Loads** PROMPT.md + existing PROGRESS.md
2. **Runs** RISKY tasks sequentially (fail fast)
3. **Executes** CORE tasks in parallel if team_size > 0
4. **Runs** POLISH tasks sequentially (cleanup)
5. **Verifies** with objective commands after each task
6. **Updates** progress (memory bridge)
7. **Loops** until done or safeguard triggers

```bash
/dev tasks/PROMPT_REDIS_CACHE.md
```

**Options:**
```bash
--mode afk     # Autonomous execution (no pauses)
--mode hitl    # Human-in-the-loop (default)
--max N        # Override max iterations
--dry-run      # Validate without executing
```

---

## team_size Field (New in v2.0)

The `team_size` field in PROMPT config enables parallel CORE task execution:

```yaml
## Config
mode: hitl
quality_tier: production
max_iterations: 30
max_retries: 3
circuit_breaker: 3
small_steps: true
feedback_loops:
  - pytest
  - ruff check
team_size: 3     # 3 parallel subagents for CORE tasks
sandbox: none    # docker | none (for AFK mode)
```

### How team_size Works

```text
team_size: 3 with 6 CORE tasks:

  Batch 1: [Task A, Task B]  → Agent 1 (background)
  Batch 2: [Task C, Task D]  → Agent 2 (background)
  Batch 3: [Task E, Task F]  → Agent 3 (background)

  All 3 agents run concurrently.
  Leader collects results when all complete.
  PROGRESS.md tracks each agent's assigned tasks.

RISKY tasks:  Always sequential (fail fast)
CORE tasks:   Parallel if team_size > 0
POLISH tasks: Always sequential (cleanup)
```

**When to use team_size:**
- 4+ independent CORE tasks: `team_size: 2`
- 7+ independent CORE tasks: `team_size: 3`
- Tasks with many cross-dependencies: `team_size: 0` (sequential)

---

## Arguments

| Argument | Description |
|----------|-------------|
| `"description"` | Natural language request → triggers prompt-crafter |
| `tasks/PROMPT_*.md` | Path to PROMPT file → triggers executor |
| `--list` | List available PROMPTs in `.claude/dev/tasks/` |
| `--mode` | Execution mode: `hitl` (default) or `afk` |
| `--resume` | Resume from existing PROGRESS file (memory bridge) |
| `--dry-run` | Validate and show plan without executing |
| `--max N` | Override max iterations (default: 30) |

---

## Workflow

### Complete Flow

```text
1. /dev "I want to build X"        # Craft phase
   ↓
2. [Questions and clarifications]   # Interactive
   ↓
3. PROMPT.md generated              # Ready to execute
   ↓
4. /dev tasks/PROMPT_X.md           # Execute phase
   ↓
5. [Loop with verification]         # Automated (parallel if team_size > 0)
   ↓
6. EXIT_COMPLETE                    # Done
```

---

## Folder Structure

```text
.claude/dev/
├── _index.md                        # Documentation
├── tasks/                           # Your PROMPT files (active work)
│   └── PROMPT_*.md
├── progress/                        # Memory bridge (auto-managed)
│   └── PROGRESS_*.md
├── logs/                            # Execution logs
│   └── LOG_*.md
└── templates/                       # Templates and examples
    ├── PROMPT_TEMPLATE.md           # Blank template (with team_size)
    ├── PROGRESS_TEMPLATE.md         # Progress file template
    ├── PROMPT_EXAMPLE_FEATURE.md    # Example: Python utility
    └── PROMPT_EXAMPLE_KB.md         # Example: KB domain
```

---

## See Also

| Resource | Path |
|----------|------|
| Level 2 Overview | `.claude/dev/_index.md` |
| Prompt Crafter Agent | `.claude/agents/dev/prompt-crafter.md` |
| Dev Loop Executor | `.claude/agents/dev/dev-loop-executor.md` |
| PROMPT Template | `.claude/dev/templates/PROMPT_TEMPLATE.md` |
| Level 3 (SDD) | `.claude/sdd/_index.md` |

---

*Dev Loop v2.0 — Ask first, execute perfectly, recover gracefully, run in parallel*
