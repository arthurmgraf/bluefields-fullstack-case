# DESIGN: AgentSpec 5.0

> Technical design for parallel SDD + Dev Loop with worktrees, Docker AFK, auto-review, persistent memory, dashboard, and contextual guidance.

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | AGENTSPEC_5 |
| **Date** | 2026-02-25 |
| **Author** | design-agent |
| **DEFINE** | [DEFINE_AGENTSPEC_5.md](./DEFINE_AGENTSPEC_5.md) |
| **Status** | Shipped |

---

## Architecture Overview

### AgentSpec 5.0 Pipeline (Full Flow)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                         AGENTSPEC 5.0 PIPELINE                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  /brainstorm ──→ /define ──→ /design ──────────→ /build ──────────────────  │
│  (sequential)   (sequential)  (parallel research)  (parallel worktrees)      │
│                                    │                     │                   │
│                             ┌──────┴──────┐       ┌─────┴──────┐            │
│                             │ bg:patterns │       │ Worktree A │            │
│                             │ bg:codebase │       │ Worktree B │            │
│                             │ bg:kb-scan  │       │ Worktree C │            │
│                             └──────┬──────┘       └─────┬──────┘            │
│                                    │                     │                   │
│                              Lider agrega          Lider mergea              │
│                                    │                     │                   │
│                                    ▼                     ▼                   │
│                                                                              │
│  ──→ auto-review ──→ /generate-diagrams ──→ /ship                           │
│      (code-reviewer)   (diagrams-agent)     (archive + lessons)              │
│                                                                              │
│  Orientacao contextual: cada fase mostra artefatos + paths + proximo passo  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Parallel /build Detail (Worktree Orchestration)

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    /BUILD PARALLEL FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. PARSE       Lider le DESIGN manifest                           │
│     │           Identifica work groups (files sem deps cruzadas)   │
│     ▼                                                               │
│  2. PLAN        Para cada work group:                              │
│     │           → Spawna subagent com permissionMode: plan         │
│     │           → Subagent gera plano (read-only)                  │
│     │           → Lider aprova/rejeita cada plano                  │
│     ▼                                                               │
│  3. EXECUTE     Subagents aprovados rodam em paralelo:             │
│     │           ┌──────────────┬──────────────┬──────────────┐     │
│     │           │ Worktree A   │ Worktree B   │ Worktree C   │     │
│     │           │ isolation:   │ isolation:   │ isolation:   │     │
│     │           │  worktree    │  worktree    │  worktree    │     │
│     │           │ background:  │ background:  │ background:  │     │
│     │           │  true        │  true        │  true        │     │
│     │           │              │              │              │     │
│     │           │ @function-   │ @python-     │ @test-       │     │
│     │           │  developer   │  developer   │  generator   │     │
│     │           └──────┬───────┴──────┬───────┴──────┬───────┘     │
│     ▼                  │              │              │              │
│  4. COLLECT    Lider aguarda todos terminarem                      │
│     │          Coleta resultados via agent resume                  │
│     ▼                                                               │
│  5. MERGE      Git merge de cada worktree na branch principal      │
│     │          Se conflito: reporta ao usuario, nao faz auto-merge │
│     ▼                                                               │
│  6. VERIFY     ruff check + pytest no codigo mergeado              │
│     │          Cache: so re-checa arquivos modificados             │
│     ▼                                                               │
│  7. REPORT     BUILD_REPORT com atribuicao por work group          │
│                + explicacao didatica de cada mudanca                │
│                                                                     │
│  DASHBOARD: Atualizado apos cada passo (parse/plan/execute/merge)  │
│                                                                     │
│  DOCKER AFK: Se --docker flag, cada worktree roda em container     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Parallel /design Detail (Background Research)

```text
┌─────────────────────────────────────────────────────────────────────┐
│                   /DESIGN PARALLEL RESEARCH                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Lider le DEFINE_{FEATURE}.md                                      │
│     │                                                               │
│     ├──→ Subagent A (background: true)                             │
│     │    "Pesquisar patterns existentes no codebase"               │
│     │    tools: [Read, Glob, Grep]                                 │
│     │                                                               │
│     ├──→ Subagent B (background: true)                             │
│     │    "Pesquisar KB domains relevantes"                         │
│     │    tools: [Read, Glob, Grep]                                 │
│     │                                                               │
│     └──→ Subagent C (background: true) [opcional]                  │
│          "Pesquisar documentacao externa via WebSearch"             │
│          tools: [Read, WebSearch, WebFetch]                        │
│                                                                     │
│  Lider aguarda resultados → Sintetiza → Gera DESIGN                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Dev Loop com team_size

```text
┌─────────────────────────────────────────────────────────────────────┐
│                  DEV LOOP COM team_size                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PROMPT.md com team_size: 3                                        │
│     │                                                               │
│     ├──→ Tasks 🔴 RISKY: Executa SEQUENCIAL (fail fast)           │
│     │                                                               │
│     ├──→ Tasks 🟡 CORE: Agrupa em N batches                       │
│     │    ┌─────────┬─────────┬─────────┐                           │
│     │    │ Agent 1 │ Agent 2 │ Agent 3 │                           │
│     │    │ Task A  │ Task B  │ Task C  │                           │
│     │    │ Task D  │ Task E  │ Task F  │                           │
│     │    └────┬────┴────┬────┴────┬────┘                           │
│     │         │         │         │                                 │
│     │         └────┬────┘         │                                 │
│     │              ▼              │                                 │
│     │         Resultados          │                                 │
│     │                             │                                 │
│     └──→ Tasks 🟢 POLISH: Executa SEQUENCIAL (cleanup)            │
│                                                                     │
│  PROGRESS.md: Rastreia todos os agents + tasks                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Workflow Contracts v5.0** | Especificacao completa do pipeline | YAML (WORKFLOW_CONTRACTS.yaml) |
| **Build Orchestrator** | Coordena parallel build com worktrees | build-agent.md (atualizado) |
| **Design Researcher** | Spawna subagents background para research | design-agent.md (atualizado) |
| **Dev Loop Executor v2** | Suporta team_size para execucao paralela | dev-loop-executor.md (atualizado) |
| **Auto-Reviewer** | Code review automatico pos-build | code-reviewer.md (com memory: project) |
| **Dashboard Generator** | Atualiza DASHBOARD em tempo real | Logica embutida no build-agent |
| **Orientacao Contextual** | Mostra artefatos + proximo passo | Logica embutida em todos os commands |
| **Templates v5.0** | Novos templates para dashboard, review, history | .claude/sdd/templates/ |

---

## Key Decisions

### Decision 1: Git Worktrees para Isolamento de Build

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** Subagents paralelos escrevendo nos mesmos arquivos causam conflitos. Precisamos de isolamento de filesystem.

**Choice:** Usar `isolation: worktree` no frontmatter dos subagents de build. Cada subagent trabalha em copia isolada do repo via git worktree.

**Rationale:** Worktrees sao nativos do git, leves (compartilham .git), e o Claude Code ja suporta via frontmatter. Nao precisa de feature experimental.

**Alternatives Rejected:**
1. Agent Teams — Experimental, sem session resume, nao roda no Windows, custo 3-5x
2. Docker containers separados — Overhead de setup, precisa copiar repo inteiro
3. Branches separadas sem worktree — Checkout alterna arquivos, nao isola

**Consequences:**
- Merge e necessario ao final (lider faz)
- Work groups DEVEM ser independentes (sem deps cruzadas)
- Worktrees temporarios sao limpos automaticamente se subagent nao faz mudancas

---

### Decision 2: Plan Mode Obrigatorio por Subagent

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** Subagents autonomos podem implementar solucoes desalinhadas com o DESIGN. Quality gate e necessario antes da implementacao.

**Choice:** Cada subagent de build inicia com `permissionMode: plan`. Gera plano read-only. Lider aprova/rejeita. So apos aprovacao o subagent implementa.

**Rationale:** Alinhado com filosofia SDD de quality gates. Previne retrabalho. Lider valida alinhamento com DESIGN antes de gastar tokens na implementacao.

**Alternatives Rejected:**
1. Delegate Mode total — Rapido mas risco de desalinhamento
2. Aprovacao manual do usuario — Muito lento, quebra o fluxo AFK
3. Verificacao pos-implementacao — Desperdicaria tokens se plano estivesse errado

**Consequences:**
- Adiciona latencia (plano → aprovacao → implementacao)
- Lider precisa de logica de review automatico
- Planos ruins sao rejeitados com feedback, subagent revisa

---

### Decision 3: Docker Sandbox Apenas no /build AFK

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** Execucao AFK (sem supervisao) precisa de sandbox para evitar danos ao sistema host.

**Choice:** Flag `--docker` no /build ativa Docker sandbox. Cada worktree roda em container com resource limits. Sem Docker, roda normal.

**Rationale:** Docker e overkill para HITL (humano supervisiona). So faz sentido em AFK onde o agente roda horas sem supervisao. Fallback gracioso: sem Docker instalado, roda sem sandbox.

**Alternatives Rejected:**
1. Docker em todas as fases — Overhead desnecessario em brainstorm/define
2. Docker obrigatorio — Quebraria em maquinas sem Docker instalado
3. Sandbox customizado — Reinventar a roda quando Docker ja existe

**Consequences:**
- Requer Docker instalado para modo AFK seguro
- Sem Docker, roda sem sandbox (usuario assume risco)
- Resource limits previnem token/CPU starvation

---

### Decision 4: Auto-Review como Fase Intermediaria

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** Codigo gerado por build precisa de revisao. Depender do usuario lembrar de pedir review e fragil.

**Choice:** code-reviewer roda automaticamente apos /build, antes de /ship. Gera REVIEW_REPORT no mesmo diretorio do BUILD_REPORT.

**Rationale:** Review automatico pega issues que verificacao mecanica (ruff/pytest) nao pega: legibilidade, patterns inconsistentes, security issues, naming.

**Alternatives Rejected:**
1. Review manual — Depende do usuario lembrar
2. Review dentro do /build — Mistura responsabilidades, BUILD_REPORT fica confuso
3. Review no /ship — Tarde demais, melhor pegar issues antes de arquivar

**Consequences:**
- Adiciona 1-3 minutos ao pipeline
- code-reviewer com `memory: project` melhora ao longo do tempo
- REVIEW_REPORT pode ter zero issues (e OK)

---

### Decision 5: Orientacao Contextual em Toda Fase

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** Usuario precisa saber: o que foi feito, onde estao os arquivos, qual o proximo passo. Hoje isso e inconsistente.

**Choice:** Toda fase termina com bloco padronizado:
```
Concluido: /fase .claude/sdd/features/ARQUIVO.md

Artefatos gerados:
  - NOME: caminho/completo.md

Proximo passo: /proxima-fase caminho/completo.md
```

**Rationale:** Reduce fricao. Usuario nunca precisa adivinhar caminhos ou proximos passos. Aumenta facilidade de uso (score 7→8).

**Alternatives Rejected:**
1. Documentacao separada — Usuario tem que procurar
2. So no /ship — Perde orientacao nas fases intermediarias

**Consequences:**
- Todas as 6 command .md files precisam de atualizacao
- Padrao consistente facilita automacao futura

---

### Decision 6: Cache de Verificacao Incremental

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** Ruff/pytest rodam em TODOS os arquivos apos cada task, mesmo que so 1 arquivo tenha mudado.

**Choice:** Verificacao incremental: track quais arquivos mudaram, so re-checa esses. Usa `git diff --name-only` para identificar alterados.

**Rationale:** Em projetos grandes, lint de tudo demora. Cache evita trabalho redundante. Melhora velocidade (8→9) e custo (6→7).

**Alternatives Rejected:**
1. Sempre rodar tudo — Seguro mas lento
2. Nunca rodar verificacao — Rapido mas inseguro
3. Hash-based caching — Mais complexo que git diff, mesma eficacia

**Consequences:**
- Verificacao FINAL (step 6) roda em tudo (safety net)
- Verificacao PER-FILE (step 3-4) e incremental
- Git diff e barato e preciso

---

### Decision 7: Frontmatter YAML em Todos os Agents

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-25 |

**Context:** 40 dos 46 agents usam markdown headers em vez de YAML frontmatter. O Claude Code espera frontmatter para features como memory, hooks, isolation.

**Choice:** Migrar TODOS os 46 agents para YAML frontmatter padronizado. Manter markdown body como system prompt.

**Rationale:** Frontmatter e o formato nativo do Claude Code para subagents. Sem ele, features como `memory: project`, `isolation: worktree`, `hooks`, e `background: true` nao funcionam.

**Alternatives Rejected:**
1. So migrar agents impactados — Inconsistencia, confusao sobre qual formato usar
2. Manter markdown headers — Nao suporta novos campos do 5.0
3. Arquivo de config separado — Duplicacao de metadata

**Consequences:**
- 40 agents precisam de conversao (mecanica, baixo risco)
- 6 agents existentes precisam de novos campos
- Design-agent muda discovery de "scan markdown" para "parse frontmatter"

---

## File Manifest

### Work Group A: Workflow Core (sem deps externas)

| # | File | Action | Purpose | Agent | Dependencies |
|---|------|--------|---------|-------|--------------|
| 1 | `.claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml` | Modify | Atualizar para v5.0: parallel build, parallel design, auto-review, dashboard, timestamps, orientacao contextual | @python-developer | None |
| 2 | `.claude/sdd/architecture/ARCHITECTURE.md` | Modify | Atualizar diagrama com fluxo paralelo AgentSpec 5.0 | @code-documenter | None |

### Work Group B: Agent Definitions (sem deps externas)

| # | File | Action | Purpose | Agent | Dependencies |
|---|------|--------|---------|-------|--------------|
| 3 | `.claude/agents/workflow/build-agent.md` | Modify | Adicionar: worktree orchestration, Plan Mode, merge, dashboard, explicacao didatica, Docker AFK | @python-developer | None |
| 4 | `.claude/agents/workflow/design-agent.md` | Modify | Adicionar: background subagent spawning, frontmatter-based agent discovery | @python-developer | None |
| 5 | `.claude/agents/workflow/ship-agent.md` | Modify | Adicionar: trigger /generate-diagrams, orientacao contextual | @python-developer | None |
| 6 | `.claude/agents/workflow/brainstorm-agent.md` | Modify | Adicionar: orientacao contextual no final | @python-developer | None |
| 7 | `.claude/agents/workflow/iterate-agent.md` | Modify | Adicionar: orientacao contextual no final | @python-developer | None |
| 8 | `.claude/agents/dev/dev-loop-executor.md` | Modify | Adicionar: team_size support, parallel batch execution, dashboard updates | @python-developer | None |
| 9 | `.claude/agents/dev/prompt-crafter.md` | Modify | Adicionar: team_size field na geracao do PROMPT, orientacao contextual | @python-developer | None |
| 10 | `.claude/agents/code-quality/code-reviewer.md` | Modify | Adicionar frontmatter: memory: project, hooks de Stop pra auto-save | @python-developer | None |

### Work Group C: Command Definitions (sem deps externas)

| # | File | Action | Purpose | Agent | Dependencies |
|---|------|--------|---------|-------|--------------|
| 11 | `.claude/commands/workflow/build.md` | Modify | Documentar fluxo paralelo, Docker AFK, Plan Mode, auto-review, dashboard | @code-documenter | None |
| 12 | `.claude/commands/workflow/design.md` | Modify | Documentar research paralelo com subagents background | @code-documenter | None |
| 13 | `.claude/commands/workflow/ship.md` | Modify | Documentar auto-diagrams trigger, orientacao contextual | @code-documenter | None |
| 14 | `.claude/commands/workflow/brainstorm.md` | Modify | Adicionar orientacao contextual no final | @code-documenter | None |
| 15 | `.claude/commands/workflow/define.md` | Modify | Adicionar orientacao contextual no final | @code-documenter | None |
| 16 | `.claude/commands/workflow/iterate.md` | Modify | Adicionar orientacao contextual no final | @code-documenter | None |
| 17 | `.claude/commands/dev/dev.md` | Modify | Documentar campo team_size, parallel execution | @code-documenter | None |

### Work Group D: Templates (sem deps externas)

| # | File | Action | Purpose | Agent | Dependencies |
|---|------|--------|---------|-------|--------------|
| 18 | `.claude/sdd/templates/BUILD_REPORT_TEMPLATE.md` | Modify | Adicionar: secao didatica por arquivo, work group attribution, dashboard link | @code-documenter | None |
| 19 | `.claude/sdd/templates/DASHBOARD_TEMPLATE.md` | Create | Template do dashboard de progresso por work group | @code-documenter | None |
| 20 | `.claude/sdd/templates/REVIEW_REPORT_TEMPLATE.md` | Create | Template do auto-review report | @code-documenter | None |
| 21 | `.claude/sdd/templates/HISTORY_TEMPLATE.md` | Create | Template do index de historico com timestamps | @code-documenter | None |
| 22 | `.claude/dev/templates/PROMPT_TEMPLATE.md` | Modify | Adicionar campo team_size e sandbox no Config section | @code-documenter | None |

### Work Group E: Project Documentation (depende de A-D)

| # | File | Action | Purpose | Agent | Dependencies |
|---|------|--------|---------|-------|--------------|
| 23 | `.claude/CLAUDE.md` | Modify | Atualizar: Architecture, Agent Usage, Commands, Scoring, Shipped Features | @code-documenter | 1-22 |

**Total Files:** 23

---

## Agent Assignment Rationale

| Agent | Files Assigned | Why This Agent |
|-------|----------------|----------------|
| @python-developer | 1, 3-10 | Agents e contracts sao especificacoes tecnicas que requerem precisao de engenheiro |
| @code-documenter | 2, 11-22 | Commands e templates sao documentacao que requer clareza e consistencia |
| (lider direto) | 23 | CLAUDE.md e o doc principal, lider atualiza diretamente com visao holistica |

**Agent Discovery:**
- Scanned: `.claude/agents/**/*.md` (46 agents)
- Matched by: File type (YAML/MD config = python-developer), purpose (documentation = code-documenter)

---

## Code Patterns

### Pattern 1: Agent Frontmatter com Novos Campos (v5.0)

```yaml
---
name: build-agent
description: |
  Implementation executor with parallel worktree orchestration (Phase 3).
  Decomposes DESIGN manifest into work groups, spawns subagents in isolated
  worktrees, coordinates Plan Mode approval, merges results, runs auto-review.

tools: [Read, Write, Edit, Bash, Glob, Grep, TodoWrite, Task]
model: sonnet
memory: project
isolation: worktree
background: false
hooks:
  Stop:
    - type: command
      command: "echo 'Saving agent memory...' && exit 0"
---

# Build Agent v5.0

[markdown body = system prompt com instrucoes detalhadas]
```

### Pattern 2: Build Orchestrator — Work Group Decomposition

```text
## Logica de Decomposicao (no system prompt do build-agent)

1. Ler File Manifest do DESIGN
2. Para cada arquivo, verificar coluna "Dependencies"
3. Agrupar arquivos que NAO dependem de nenhum arquivo em outro grupo
4. Regra: se arquivo A depende de arquivo B, ambos devem estar no MESMO work group
5. Resultado: N work groups onde nenhum grupo depende de outro

Exemplo:
  Manifest:
    | # | File      | Dependencies |
    | 1 | config.py | None         |  → Group A
    | 2 | utils.py  | None         |  → Group A
    | 3 | handler.py| 1, 2         |  → Group A (mesma dep chain)
    | 4 | api.py    | None         |  → Group B (independente)
    | 5 | test_api.py| 4           |  → Group B (mesma dep chain)
    | 6 | test_handler.py| 3       |  → Group A (mesma dep chain)

  Work Groups:
    A: [1, 2, 3, 6] — config + utils + handler + test_handler
    B: [4, 5]       — api + test_api
```

### Pattern 3: Subagent Spawn com Worktree Isolation

```text
## No system prompt do build-agent, instrucao para spawnar subagents:

Para cada work group aprovado:

Task(
  subagent_type: "{agent-name-from-manifest}",
  description: "Build Work Group {X}",
  prompt: """
    Voce esta implementando o Work Group {X} do DESIGN_{FEATURE}.md.

    Arquivos a criar:
    {lista de arquivos do work group}

    Code Patterns (do DESIGN):
    {patterns relevantes}

    Regras:
    - Siga os patterns exatamente
    - Type hints obrigatorios
    - Sem comentarios inline
    - Ao terminar cada arquivo, explique:
      1. O QUE foi feito (1-2 frases)
      2. POR QUE dessa forma (decisao tecnica)
      3. COMO funciona (explicacao didatica)
    - Rode ruff check em cada arquivo criado
  """,
  run_in_background: true
)
```

### Pattern 4: Dashboard Template

```markdown
# DASHBOARD: {FEATURE_NAME}

> Progresso em tempo real do /build paralelo

**Last Updated:** {YYYY-MM-DD HH:MM}
**Pipeline Status:** {PARSING | PLANNING | EXECUTING | MERGING | VERIFYING | COMPLETE}

## Work Groups

| Group | Agent | Status | Files Done | Verificacao |
|-------|-------|--------|------------|-------------|
| A: Backend | @function-developer | 🟢 3/3 | handler.py, config.py, utils.py | ruff PASS |
| B: Frontend | @python-developer | 🟡 1/2 | views.py | — |
| C: Tests | @test-generator | ⏳ Waiting | — | — |

## Timeline

| Step | Started | Completed | Duration |
|------|---------|-----------|----------|
| Parse manifest | 14:30 | 14:30 | < 1min |
| Plan Mode review | 14:31 | 14:35 | 4min |
| Parallel execution | 14:35 | — | — |
| Merge | — | — | — |
| Verification | — | — | — |
| Auto-review | — | — | — |

## Issues

| # | Issue | Work Group | Resolution |
|---|-------|------------|------------|
| (none) | | | |
```

### Pattern 5: Review Report Template

```markdown
# REVIEW REPORT: {FEATURE_NAME}

> Auto-review gerado por code-reviewer apos /build

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | {FEATURE_NAME} |
| **Date** | {YYYY-MM-DD} |
| **Reviewer** | code-reviewer (memory: project) |
| **Files Reviewed** | {N} |
| **Issues Found** | {N} |

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | {N} |
| 🟡 Warning | {N} |
| 🟢 Suggestion | {N} |

## Issues

### 🔴 Critical

{Nenhum ou lista de issues criticos com arquivo, linha, descricao, fix sugerido}

### 🟡 Warning

{Lista de warnings}

### 🟢 Suggestion

{Lista de sugestoes}

## Patterns Observados

{Patterns positivos ou negativos que o reviewer notou — salvos na memory para proximas reviews}
```

### Pattern 6: Orientacao Contextual (Final de Fase)

```text
## Padrao para TODAS as fases (adicionado ao final de cada command .md):

### Finalizacao

Ao concluir a fase, SEMPRE mostre:

```
---
Concluido: /{fase} {caminho_do_input}

Artefatos gerados:
  - {TIPO}: {caminho_completo}
  - {TIPO}: {caminho_completo}

Proximo passo: /{proxima_fase} {caminho_do_artefato_principal}
---
```

Exemplos:

/brainstorm:
  Artefatos: BRAINSTORM_{FEATURE}.md
  Proximo: /define .claude/sdd/features/BRAINSTORM_{FEATURE}.md

/define:
  Artefatos: DEFINE_{FEATURE}.md
  Proximo: /design .claude/sdd/features/DEFINE_{FEATURE}.md

/design:
  Artefatos: DESIGN_{FEATURE}.md
  Proximo: /build .claude/sdd/features/DESIGN_{FEATURE}.md

/build:
  Artefatos: BUILD_REPORT, REVIEW_REPORT, DASHBOARD, codigo
  Proximo: /ship .claude/sdd/features/DEFINE_{FEATURE}.md

/ship:
  Artefatos: SHIPPED_{DATE}.md, archive/
  Proximo: (nenhum — feature completa)
```

### Pattern 7: PROMPT.md com team_size (Dev Loop)

```yaml
## Config
```yaml
mode: hitl | afk
quality_tier: production
max_iterations: 30
max_retries: 3
circuit_breaker: 3
small_steps: true
feedback_loops: [pytest, ruff check]

# NOVO em AgentSpec 5.0:
team_size: 3          # Numero de subagents paralelos (0 = sequencial)
sandbox: docker       # docker | none (so pra AFK mode)
```
```

### Pattern 8: History Index Template

```markdown
# HISTORY: {FEATURE_NAME}

> Registro cronologico de todos os artefatos gerados

| # | Artefato | Criado | Atualizado | Status | Fase |
|---|----------|--------|------------|--------|------|
| 1 | BRAINSTORM_{FEATURE}.md | 2026-02-25 14:30 | 2026-02-25 15:00 | Complete (Defined) | Phase 0 |
| 2 | DEFINE_{FEATURE}.md | 2026-02-25 15:15 | 2026-02-25 15:45 | Complete (Designed) | Phase 1 |
| 3 | DESIGN_{FEATURE}.md | 2026-02-25 16:00 | 2026-02-25 17:00 | Complete (Built) | Phase 2 |
| 4 | DASHBOARD_{FEATURE}.md | 2026-02-25 17:00 | 2026-02-25 17:30 | Complete | Phase 3 |
| 5 | BUILD_REPORT_{FEATURE}.md | 2026-02-25 17:30 | 2026-02-25 17:30 | Complete | Phase 3 |
| 6 | REVIEW_REPORT_{FEATURE}.md | 2026-02-25 17:35 | 2026-02-25 17:35 | Complete | Phase 3.5 |
| 7 | SHIPPED_{DATE}.md | 2026-02-25 18:00 | 2026-02-25 18:00 | Shipped | Phase 4 |
```

---

## Data Flow

```text
1. /brainstorm: Usuario descreve ideia
   │
   ▼
2. /define: Requisitos validados (Clarity Score >= 12)
   │
   ▼
3. /design: Lider spawna subagents background para research
   │         Subagents pesquisam patterns, codebase, KB
   │         Lider sintetiza → DESIGN com file manifest + work groups
   │
   ▼
4. /build:
   │  4a. Lider parse manifest → identifica work groups
   │  4b. Spawna subagents em Plan Mode (read-only)
   │  4c. Revisa/aprova cada plano
   │  4d. Subagents implementam em worktrees isolados (paralelo)
   │  4e. Lider mergea worktrees → branch principal
   │  4f. Verificacao final (ruff + pytest) com cache incremental
   │  4g. Gera BUILD_REPORT com explicacao didatica
   │  4h. Atualiza DASHBOARD
   │
   ▼
5. Auto-review: code-reviewer analisa codigo mergeado
   │             Gera REVIEW_REPORT
   │             Salva patterns na memory
   │
   ▼
6. /generate-diagrams: Gera Excalidraw da arquitetura implementada
   │
   ▼
7. /ship: Arquiva tudo + licoes aprendidas + HISTORY index
```

---

## Integration Points

| External System | Integration Type | Authentication |
|-----------------|-----------------|----------------|
| Git (worktrees) | CLI (`git worktree add/remove`) | Local git config |
| Docker | CLI (`docker sandbox run claude`) | Docker daemon local |
| CodeMap Hotel | WebSocket (localhost:5174) | None (local) |
| Claude Code Subagents | Task tool com frontmatter | Session tokens |

---

## Testing Strategy

| Test Type | Scope | What to Test | How to Verify |
|-----------|-------|--------------|---------------|
| **Smoke** | Pipeline inteiro | /brainstorm → /define → /design → /build → /ship em feature sintetica | Todos os artefatos gerados nos paths corretos |
| **Parallel Build** | /build com 3 work groups | DESIGN com 3 groups independentes | 3 subagents rodam simultaneamente, merge limpo |
| **Plan Mode** | Subagent approval | Subagent gera plano, lider rejeita, subagent revisa | Plano revisado e diferente do original |
| **Auto-Review** | Post-build review | Codigo com issue intencional | REVIEW_REPORT detecta o issue |
| **Dashboard** | Real-time updates | /build com 2+ work groups | DASHBOARD atualiza apos cada group completar |
| **Dev Loop team_size** | Parallel PROMPT execution | PROMPT com team_size: 2 e 4 tasks | 2 subagents executam 2 tasks cada |
| **Orientacao Contextual** | Todas as fases | Executar cada fase | Final mostra artefatos + paths + proximo passo |
| **Worktree Conflict** | 2 worktrees editam mesmo arquivo | Particionamento ruim intencional | Lider detecta conflito, nao faz auto-merge |
| **Cache Verificacao** | Lint incremental | Mudar 1 de 10 arquivos | Ruff checa so o arquivo modificado |
| **Memory Persistente** | code-reviewer entre sessoes | Sessao 1: review descobre pattern. Sessao 2: review lembra | Pattern referenciado na sessao 2 |

---

## Error Handling

| Error Type | Handling Strategy | Retry? |
|------------|-------------------|--------|
| Subagent falha no worktree | Lider tenta resume do subagent; se falha, executa direto | Yes (1x) |
| Worktree merge conflict | Reporta ao usuario com diff; nao faz auto-merge | No |
| Plan Mode rejeitado 3x | Lider assume a task e implementa direto | No |
| Docker nao instalado | Fallback: roda sem sandbox, avisa usuario | No |
| Subagent atinge context limit | Hook de Stop salva estado na memory | No |
| CodeMap nao instalado | Ignora; dashboard de texto funciona sem CodeMap | No |
| Cache desatualizado | Roda verificacao completa (fallback seguro) | N/A |

---

## Configuration

| Config Key | Type | Default | Description |
|------------|------|---------|-------------|
| `team_size` | int | 0 | Numero de subagents paralelos (0 = sequencial) |
| `sandbox` | string | "none" | "docker" ou "none" |
| `auto_review` | bool | true | Rodar code-reviewer apos /build |
| `auto_diagrams` | bool | true | Rodar /generate-diagrams antes de /ship |
| `cache_verification` | bool | true | Cache incremental de lint/typecheck |
| `plan_mode_required` | bool | true | Exigir aprovacao de plano antes de implementar |
| `max_work_groups` | int | 5 | Maximo de worktrees simultaneos |
| `dashboard_enabled` | bool | true | Gerar DASHBOARD durante /build |

---

## Security Considerations

- Docker sandbox previne acesso ao filesystem host em modo AFK
- Worktrees isolam mudancas (nenhum subagent modifica branch principal diretamente)
- Plan Mode previne implementacao desalinhada
- Memory persistente e local (`.claude/agent-memory/`) — nao contem secrets
- Hooks executam apenas scripts locais do projeto

---

## Observability

| Aspect | Implementation |
|--------|----------------|
| Logging | DASHBOARD_{FEATURE}.md com status por work group |
| Progress | TodoWrite atualizado por task + PROGRESS.md no Dev Loop |
| Attribution | BUILD_REPORT com agent + work group por arquivo |
| History | HISTORY_{FEATURE}.md com timestamps de todos os artefatos |
| Review | REVIEW_REPORT com issues por severidade |
| Visualization | CodeMap Hotel (opcional) via WebSocket |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-25 | design-agent | Versao inicial |
| 1.1 | 2026-02-25 | ship-agent | Status updated to Shipped; archived to .claude/sdd/archive/AGENTSPEC_5/ |

---

## Next Step

**Ready for:** `/build .claude/sdd/features/DESIGN_AGENTSPEC_5.md`
