# BRAINSTORM: AgentSpec 5.0

> Evolucao do SDD + Dev Loop com paralelismo via worktrees, auto-review, dashboard, memoria persistente e visualizacao CodeMap.

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | AGENTSPEC_5 |
| **Date** | 2026-02-25 |
| **Author** | brainstorm-agent |
| **Status** | Complete (Defined) |

---

## Initial Idea

**Raw Input:** "E possivel melhorar o meu SDD e dev loop? Gostaria de usar o agent teams, mas gosto muito de usar o SDD, entao gostaria de usar algo que fosse um mergeado disso tudo com uma media mais alta que eles individuais."

**Context Gathered:**
- SDD atual (AgentSpec 4.2) tem media 6.4/10 — forte em rastreabilidade (10), qualidade (9), KB (9), mas fraco em paralelismo (2), facilidade (4), velocidade (5)
- Dev Loop atual tem media 6.2/10 — forte em recovery (9), custo-beneficio (8), mas fraco em paralelismo (1)
- Agent Teams (Claude Code oficial) tem media 6.1/10 — forte em paralelismo (10), velocidade (9), escala (9), mas fraco em recovery (2), rastreabilidade (3), KB (3)
- Ralph Wiggum tem media 5.1/10 — forte em facilidade (9), flexibilidade (8), mas fraco em rastreabilidade (3), recovery (3)
- Subagents tem media 5.3/10 — building block atomico usado por todos os outros

**Technical Context Observed (for Define):**

| Aspect | Observation | Implication |
|--------|-------------|-------------|
| Likely Location | .claude/sdd/, .claude/agents/, .claude/commands/ | Workflow contracts, agent defs, command defs |
| Relevant KB Domains | crewai (orchestracao), gcp (deploy) | CrewAI patterns: hierarchical process, circuit breaker, fan-out/fan-in |
| IaC Patterns | N/A (metodo de desenvolvimento, nao infraestrutura) | Mudancas em YAML contracts, MD templates, agent definitions |

---

## Discovery Questions & Answers

| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | Qual e a maior dor usando o SDD atual? | Falta de paralelismo | O /build precisa de execucao paralela como prioridade #1 |
| 2 | Onde quer paralelismo? So /build ou mais fases? | /build + /design | Design ganha research paralelo, Build ganha worktrees |
| 3 | Plan Mode ou Delegate Mode no /build paralelo? | Plan Mode obrigatorio | Cada subagent apresenta plano ao lider antes de implementar |
| 4 | Dev Loop continua separado ou e absorvido? | Dev Loop ganha teammates | PROMPT.md ganha `team_size` opcional pra spawnar subagents paralelos |
| 5 | Quais referencias usar? | CrewAI KB + Subagents doc | CrewAI: hierarchical process, circuit breaker. Subagents: worktrees, memory, hooks |
| 6 | YAGNI — quais extras incluir? | Todos: memory, hooks, team_size | Memory persistente por agente, hooks por subagente, Dev Loop com teams |
| 7 | Mais alguma coisa? | Auto-review, dashboard, codemap, historico timestamps, auto-save, explicacoes didaticas, diagramas automaticos | 7 capacidades adicionais no pacote final |

---

## Sample Data Inventory

| Type | Location | Count | Notes |
|------|----------|-------|-------|
| Input files | .claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml | 1 | 839 linhas — spec completa do AgentSpec 4.2 |
| Output examples | .claude/sdd/archive/ | 6 | Features shipped com todos os artefatos |
| Ground truth | .claude/sdd/templates/ | 5 | Templates de cada fase |
| Related code | .claude/agents/workflow/ | 6 | Agent definitions atuais |
| Related code | .claude/commands/workflow/ | 6 | Command definitions atuais |
| Related code | .claude/dev/ | all | Dev Loop: templates, progress, tasks |
| External ref | Claude Code Agent Teams docs | 1 | https://code.claude.com/docs/en/agent-teams |
| External ref | Claude Code Subagents docs | 1 | https://code.claude.com/docs/en/sub-agents |
| External ref | Matt Pocock Ralph Wiggum | 1 | https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum |
| External ref | Ethan Mollick org theory | 1 | https://x.com/emollick/status/2020303173362012667 |
| External ref | CodeMap Hotel | 1 | https://github.com/jamsusmaximus/codemap |

**How samples will be used:**

- WORKFLOW_CONTRACTS.yaml sera a base para o 5.0 (evolucao, nao rewrite)
- Templates existentes serao expandidos com novos campos
- Agent definitions serao atualizados com frontmatter (isolation, memory, hooks)
- Archive sera referencia de como artefatos ficam ao final
- CrewAI KB: patterns de circuit breaker, hierarchical delegation, fan-out/fan-in
- Subagents doc: worktree isolation, persistent memory, hooks por agente, background execution

---

## Approaches Explored

### Approach A: AgentSpec 5.0 — SDD + Parallel Build via Subagents em Worktrees ⭐ Recommended

**Description:** Manter o pipeline SDD de 5 fases intacto mas turbinar /design e /build com subagents em background rodando em git worktrees isolados. Dev Loop ganha `team_size` opcional no PROMPT.md. Adicionar auto-review, dashboard, memoria persistente, CodeMap, explicacoes didaticas, diagramas automaticos, e historico com timestamps.

```
/brainstorm → /define → /design (parallel research) → /build (parallel worktrees) → auto-review → /generate-diagrams → /ship
                              │                              │
                       ┌──────┴──────┐                ┌─────┴──────┐
                       │ Subagent A  │                │ Worktree A │
                       │ (patterns)  │                │ (backend)  │
                       │ background  │                │ isolation  │
                       ├─────────────┤                ├────────────┤
                       │ Subagent B  │                │ Worktree B │
                       │ (codebase)  │                │ (frontend) │
                       │ background  │                │ isolation  │
                       └─────────────┘                ├────────────┤
                                                      │ Worktree C │
                                                      │ (tests)    │
                                                      │ isolation  │
                                                      └─────┬──────┘
                                                            │
                                                     Lider merge all
                                                     → verify → report
```

**Pros:**
- Funciona HOJE — sem feature experimental (subagents + worktrees ja disponiveis)
- Worktree isolado = zero conflito de arquivo entre agentes
- Mantem TODA a rastreabilidade do SDD (boundary objects intactos)
- PROGRESS.md + resume continuam funcionando
- Custo controlavel (subagents mais baratos que Agent Teams)
- Memory persistente acumula conhecimento entre sessoes
- Auto-review garante qualidade sem intervencao manual
- Dashboard da visibilidade em tempo real
- CodeMap da visualizacao pixel-art dos agentes
- Explicacoes didaticas transformam BUILD_REPORT em documento educacional
- Diagramas automaticos documentam cada feature visualmente
- Historico com timestamps permite auditoria completa

**Cons:**
- Subagents nao se comunicam entre si (so report back ao lider)
- Sem mailbox/broadcast — lider media tudo
- Worktree merge pode ter conflitos (mitigado por work groups independentes)
- Complexidade adicional vs SDD atual (mais agents, mais config)
- Auto-review + diagramas adicionam tempo ao pipeline

**Why Recommended:** Resolve o problema principal (paralelismo) sem depender de features experimentais. Quando Agent Teams sair do experimental, migra gradualmente. Aplica Mollick: boundary objects (SDD specs), spans of control (lider + worktrees), medium coupling (Plan Mode).

---

### Approach B: AgentSpec 5.0 — SDD + Agent Teams Nativo

**Description:** Substituir subagents por Agent Teams oficiais no /design e /build. Usar mailbox para comunicacao inter-agente, shared task list para coordenacao.

**Pros:**
- Paralelismo real com comunicacao inter-agente (mailbox + broadcast)
- Teammates se auto-organizam via shared task list
- UI com tmux split panes — ve todos ao mesmo tempo
- Hipoteses concorrentes no /design (debate entre teammates)

**Cons:**
- Feature EXPERIMENTAL (sem session resumption, shutdown lento, limitacoes conhecidas)
- Perde PROGRESS.md recovery (Agent Teams nao suporta resume)
- Custo de tokens 3-5x maior (cada teammate e sessao completa)
- Nao roda no Windows/VS Code terminal (tmux requer macOS/Linux)
- Precisa de flag experimental `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`
- Sem git worktree isolation — risco de conflitos de arquivo

---

### Approach C: Hibrido — Agent Teams para /design, Worktrees para /build

**Description:** Agent Teams no /design (onde comunicacao inter-agente importa para debate de abordagens) e subagents com worktrees no /build (onde isolamento de arquivos e critico).

**Pros:**
- /design ganha debate real entre teammates (mailbox)
- /build ganha isolamento sem conflito (worktrees)
- Melhor ferramenta para cada fase

**Cons:**
- Complexidade de dois sistemas diferentes na mesma pipeline
- Depende de Agent Teams (experimental) na metade do fluxo
- Overhead cognitivo de quando usar qual sistema
- Mais dificil de debuggar problemas

---

## Selected Approach

| Attribute | Value |
|-----------|-------|
| **Chosen** | Approach A — SDD + Parallel Build via Subagents em Worktrees |
| **User Confirmation** | 2026-02-25 |
| **Reasoning** | Funciona hoje, sem experimental. Resolve paralelismo via worktrees. Mantem rastreabilidade total. Migra gradualmente pra Agent Teams quando estabilizar. |

---

## Key Decisions Made

| # | Decision | Rationale | Alternative Rejected |
|---|----------|-----------|----------------------|
| 1 | Worktrees em vez de Agent Teams | Funciona hoje, isolamento de arquivos, sem flag experimental | Agent Teams: experimental, sem recovery, caro |
| 2 | Plan Mode obrigatorio no /build | Alinhado com filosofia SDD de quality gates. Cada subagent apresenta plano antes de codar | Delegate Mode: rapido mas desalinhamento risco |
| 3 | Dev Loop ganha team_size (nao e absorvido) | Usuario quer ambos os sistemas evoluindo separadamente | Absorver Dev Loop no SDD: perderia simplicidade |
| 4 | Memory persistente por agente | Subagents acumulam conhecimento entre sessoes (code-reviewer lembra patterns) | Sem memory: cada sessao comeca do zero |
| 5 | Hooks por subagente | PreToolUse/PostToolUse por agent (ex: lint automatico apos Edit) | Sem hooks: menos controle de qualidade |
| 6 | Auto-review obrigatorio apos /build | code-reviewer roda automaticamente, gera REVIEW_REPORT | Review manual: depende do usuario lembrar |
| 7 | Dashboard de progresso | DASHBOARD_{FEATURE}.md atualizado em tempo real por work group | Sem dashboard: perda de visibilidade |
| 8 | CodeMap Hotel integration | Visualizacao pixel-art em tempo real dos agentes trabalhando | Terminal-only: menos intuitivo |
| 9 | Explicacoes didaticas obrigatorias | BUILD_REPORT explica o que, por que, e como de cada mudanca | Report tecnico seco: menos valor educacional |
| 10 | Diagramas automaticos via /generate-diagrams | Roda automaticamente entre /build e /ship | Diagramas manuais: esquece de gerar |
| 11 | Historico com timestamps nos nomes | DEFINE_FEATURE_2026-02-25T14-30.md + HISTORY index file | Nomes sem data: perde rastreio temporal |
| 12 | Auto-save de memoria antes de contexto acabar | Hook de Stop salva estado na memory/ antes do subagent morrer | Sem auto-save: perde contexto em crash |

---

## Features Removed (YAGNI)

| Feature Suggested | Reason Removed | Can Add Later? |
|-------------------|----------------|----------------|
| Competing hypotheses no /design | Requer comunicacao inter-agente (Agent Teams). Na Approach A so temos report-back | Yes — quando migrar pra Agent Teams |
| Nested teams (teammates que spawnam sub-teammates) | Agent Teams nao suporta. Subagents tambem nao podem spawnar subagents | Yes — se Anthropic adicionar |
| Notification CLI (WhatsApp/Telegram) | Nice-to-have do Ralph Wiggum. Nao resolve o problema principal | Yes — trivial de adicionar depois |

---

## Incremental Validations

| Section | Presented | User Feedback | Adjusted? |
|---------|-----------|---------------|-----------|
| 3 abordagens (A/B/C) | Presented | Escolheu A: Worktrees | No |
| Fluxo /build paralelo (7 passos) | Presented | Quer Plan Mode obrigatorio | Yes — adicionou aprovacao antes de implementar |
| YAGNI check (memory, hooks, team_size) | Presented | Quer todas as 3 | No — incluiu todas |
| Scoring projetado v1 (8.0) | Presented | Quer melhorar mais | Yes |
| 4 extras (historico, auto-save, didatico, diagramas) | Presented | Aprovado | No |
| Scoring v2 (8.3) | Presented | Mais: auto-review, dashboard, codemap | Yes |
| Scoring v3 (8.5) | Presented | Aprovado | No |

---

## Suggested Requirements for /define

Based on this brainstorm session, the following should be captured in the DEFINE phase:

### Problem Statement (Draft)

O SDD (AgentSpec 4.2) e o Dev Loop carecem de paralelismo real na execucao, limitando velocidade de entrega e impedindo que trabalho independente rode simultaneamente.

### Target Users (Draft)

| User | Pain Point |
|------|------------|
| Desenvolvedor solo usando SDD | /build roda 1 arquivo por vez, mesmo quando sao independentes |
| Desenvolvedor usando Dev Loop | PROMPT.md executa tasks sequencialmente, sem opcao de paralelizar |
| Reviewer | Nao tem auto-review; precisa lembrar de pedir revisao |

### Success Criteria (Draft)

- [ ] /build executa work groups independentes em paralelo via git worktrees
- [ ] /design spawna subagents em background para research paralelo
- [ ] Dev Loop PROMPT.md suporta campo `team_size` para execucao paralela
- [ ] Cada subagent no /build roda em Plan Mode obrigatorio (plano antes de codar)
- [ ] Auto-review roda automaticamente apos /build, gerando REVIEW_REPORT
- [ ] DASHBOARD_{FEATURE}.md atualiza em tempo real o status de cada work group
- [ ] Memory persistente por agente (memory: project) funciona entre sessoes
- [ ] Hooks por subagente (PreToolUse, PostToolUse, Stop) configurados
- [ ] BUILD_REPORT inclui explicacao didatica de cada mudanca (o que, por que, como)
- [ ] /generate-diagrams roda automaticamente entre /build e /ship
- [ ] Historico com timestamps nos nomes de artefatos + HISTORY index file
- [ ] Auto-save de memoria antes do contexto acabar (hook de Stop)
- [ ] CodeMap Hotel integrado como visualizacao durante /build paralelo
- [ ] Scoring medio do sistema >= 8.0/10

### Constraints Identified

- Nao usar Agent Teams (experimental, sem recovery, nao roda no Windows)
- Usar apenas subagents + worktrees (features estaveis do Claude Code)
- Manter compatibilidade com SDD 4.2 existente (evolucao, nao rewrite)
- Manter compatibilidade com Dev Loop existente (adicao de team_size, nao mudanca de fluxo)
- Worktrees so funcionam para work groups com zero dependencias entre si

### Out of Scope (Confirmed)

- Competing hypotheses no /design (requer Agent Teams)
- Nested teams / sub-teammates (nao suportado)
- Notification CLI (WhatsApp/Telegram)
- Migracao para Agent Teams (sera feature futura separada)
- Mudancas em fases anteriores ao /design (brainstorm e define continuam sequenciais)

---

## Session Summary

| Metric | Value |
|--------|-------|
| Questions Asked | 7 (+ 2 YAGNI + 3 validations) |
| Approaches Explored | 3 (A: Worktrees, B: Agent Teams, C: Hibrido) |
| Features Removed (YAGNI) | 3 (competing hypotheses, nested teams, notifications) |
| Validations Completed | 7 |
| Duration | ~45 min |
| External References Analyzed | 5 (Agent Teams docs, Subagents docs, Ralph Wiggum, Mollick, CodeMap) |
| KB Domains Consulted | 1 (CrewAI) |
| Scoring Projetado | 8.5/10 (vs 6.4 do SDD atual) |

---

## Next Step

**Ready for:** `/define .claude/sdd/features/BRAINSTORM_AGENTSPEC_5.md`
