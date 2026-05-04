# DEFINE: AgentSpec 5.0

> Evolucao do SDD e Dev Loop com paralelismo via worktrees + Docker, auto-review, dashboard, memoria persistente, CodeMap, e orientacao contextual — atingindo score medio 9.0/10.

## Metadata

| Attribute | Value |
|-----------|-------|
| **Feature** | AGENTSPEC_5 |
| **Date** | 2026-02-25 |
| **Author** | define-agent |
| **Status** | Shipped |
| **Clarity Score** | 14/15 |
| **Source** | BRAINSTORM_AGENTSPEC_5.md |

---

## Problem Statement

O SDD (AgentSpec 4.2, media 6.4/10) e o Dev Loop (media 6.2/10) executam tarefas sequencialmente, mesmo quando sao independentes. O /build roda 1 arquivo por vez, o /design pesquisa patterns em serie, e o Dev Loop nao tem opcao de paralelizar. Isso limita velocidade de entrega (score 5), paralelismo (score 2), e facilidade de uso (score 4). Alem disso, nao ha auto-review, dashboard de progresso, memoria persistente por agente, explicacoes didaticas, diagramas automaticos, ou sandbox seguro para execucao AFK.

---

## Target Users

| User | Role | Pain Point |
|------|------|------------|
| Desenvolvedor solo usando SDD | Autor de features via /brainstorm → /ship | /build roda 1 arquivo por vez; espera desnecessaria quando work groups sao independentes |
| Desenvolvedor usando Dev Loop | Executor de PROMPT.md para prototipos e utilities | PROMPT.md executa tasks sequencialmente sem opcao de paralelizar |
| Reviewer | Quem precisa revisar codigo gerado | Nao existe auto-review; precisa lembrar de pedir revisao manualmente |
| Aprendiz | Quem estuda o codigo gerado | BUILD_REPORT e tecnico demais; nao explica o "por que" das decisoes |

---

## Goals

| Priority | Goal |
|----------|------|
| **MUST** | /build executa work groups independentes em paralelo via git worktrees com subagents |
| **MUST** | Cada subagent no /build roda em Plan Mode obrigatorio (apresenta plano antes de codar) |
| **MUST** | /design spawna subagents em background para research paralelo de patterns e codebase |
| **MUST** | Auto-review obrigatorio apos /build (code-reviewer gera REVIEW_REPORT) |
| **MUST** | Orientacao contextual ao final de cada fase (artefatos gerados + proximo passo + paths) |
| **SHOULD** | Dev Loop PROMPT.md suporta campo `team_size` para execucao paralela |
| **SHOULD** | DASHBOARD_{FEATURE}.md atualizado em tempo real com status por work group |
| **SHOULD** | Memory persistente por agente (`memory: project`) funciona entre sessoes |
| **SHOULD** | Hooks por subagente (PreToolUse, PostToolUse, Stop) configurados no frontmatter |
| **SHOULD** | BUILD_REPORT inclui explicacao didatica de cada mudanca (o que, por que, como funciona) |
| **SHOULD** | Docker sandbox no /build AFK para execucao segura sem supervisao |
| **SHOULD** | Cache de verificacao (lint/typecheck nao re-roda se arquivos nao mudaram) |
| **SHOULD** | /generate-diagrams roda automaticamente entre /build e /ship |
| **SHOULD** | Historico com timestamps nos nomes de artefatos + HISTORY index file |
| **SHOULD** | Auto-save de memoria antes do contexto acabar (hook de Stop nos subagents) |
| **COULD** | CodeMap Hotel integrado como visualizacao durante /build paralelo |

---

## Success Criteria

- [ ] /build com 3+ work groups independentes completa em tempo < 50% do sequencial
- [ ] 100% dos subagents no /build apresentam plano antes de implementar (Plan Mode)
- [ ] /design spawna 2+ subagents em background e agrega resultados
- [ ] REVIEW_REPORT gerado automaticamente apos cada /build sem intervencao manual
- [ ] Toda fase termina mostrando: artefatos gerados + caminhos + proximo comando
- [ ] Dev Loop com `team_size: 3` spawna 3 subagents e completa mais rapido que sequencial
- [ ] DASHBOARD mostra status de cada work group apos cada task completada
- [ ] Subagents com `memory: project` lembram patterns de sessoes anteriores
- [ ] BUILD_REPORT tem secao didatica por arquivo (o que, por que, como)
- [ ] /build AFK em Docker container roda sem danificar sistema host
- [ ] Cache de verificacao evita re-run de lint quando nenhum arquivo mudou
- [ ] Diagramas Excalidraw gerados automaticamente entre /build e /ship
- [ ] Nomes de artefatos incluem timestamp (ex: DEFINE_FEATURE_2026-02-25T14-30.md)
- [ ] Scoring medio do sistema >= 9.0/10 na avaliacao comparativa

---

## Acceptance Tests

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AT-001 | Parallel build basico | DESIGN com 3 work groups independentes (backend, frontend, tests) | /build executa | 3 subagents rodam em worktrees isolados simultaneamente; lider mergea ao final |
| AT-002 | Plan Mode enforcement | Subagent recebe task de implementacao | Subagent inicia | Subagent apresenta plano ao lider; so implementa apos aprovacao |
| AT-003 | Auto-review | /build completa com sucesso | Pipeline continua | code-reviewer roda automaticamente; REVIEW_REPORT aparece em .claude/sdd/reports/ |
| AT-004 | Orientacao contextual | Qualquer fase completa | Fase termina | Mostra lista de artefatos com paths absolutos + proximo comando sugerido |
| AT-005 | Dev Loop com team_size | PROMPT.md tem `team_size: 3` e 6 tasks | /dev executa | 3 subagents pegam 2 tasks cada; PROGRESS.md rastreia todos |
| AT-006 | Dashboard update | Work group A completa no /build | Subagent A reporta | DASHBOARD.md atualiza status do group A para completo |
| AT-007 | Memory persistente | code-reviewer roda na sessao 1 e descobre pattern | code-reviewer roda na sessao 2 | Lembra o pattern e referencia no review |
| AT-008 | Docker AFK safety | /build roda em Docker sandbox AFK | Agente tenta rm -rf / | Container impede; sistema host intacto |
| AT-009 | Cache de verificacao | Lint rodou em 10 arquivos; 2 mudaram | Verificacao re-roda | So re-checa os 2 arquivos modificados |
| AT-010 | Diagrama automatico | /build completa | Pipeline continua antes do /ship | /generate-diagrams gera Excalidraw com arquitetura do que foi implementado |
| AT-011 | Worktree merge sem conflito | 3 worktrees modificam arquivos diferentes | Lider mergea | Merge limpo, sem conflitos, codigo integrado |
| AT-012 | Worktree merge COM conflito | 2 worktrees modificam mesmo arquivo (falha de particionamento) | Lider tenta mergear | Lider detecta conflito, reporta ao usuario, nao faz merge automatico |
| AT-013 | Explicacao didatica | Subagent cria handler.py | BUILD_REPORT e gerado | Secao do handler.py explica: o que faz, por que dessa forma, como funciona internamente |
| AT-014 | Timestamp em artefatos | /define gera documento | Arquivo e salvo | Nome inclui timestamp: DEFINE_FEATURE_2026-02-25T14-30.md |
| AT-015 | Auto-save de memoria | Subagent atinge 90% do contexto | Hook de Stop dispara | Estado salvo em .claude/agent-memory/{agent}/ antes de compaction |

---

## Out of Scope

- Competing hypotheses no /design (requer Agent Teams experimental com mailbox)
- Nested teams / sub-teammates (nao suportado por subagents)
- Notification CLI (WhatsApp/Telegram) para alertas de conclusao
- Migracao para Agent Teams (sera feature futura quando sair do experimental)
- Mudancas em /brainstorm e /define (continuam sequenciais — paralelismo so em /design e /build)
- Docker em fases que nao sao /build AFK
- UI customizada (usa terminal nativo + CodeMap opcional)

---

## Constraints

| Type | Constraint | Impact |
|------|------------|--------|
| Technical | Nao usar Agent Teams (experimental, sem recovery, sem Windows) | Subagents + worktrees sao a alternativa estavel |
| Technical | Subagents nao se comunicam entre si (so report back) | Lider media toda coordenacao; sem debate inter-agente |
| Technical | Worktrees so funcionam para work groups com ZERO dependencias | Design deve particionar file manifest em grupos independentes |
| Technical | Docker sandbox requer Docker instalado na maquina | Fallback: roda sem Docker em modo normal (sem sandbox) |
| Compatibilidade | Manter retrocompatibilidade com SDD 4.2 | Evolucao, nao rewrite. Features existentes continuam funcionando |
| Compatibilidade | Manter retrocompatibilidade com Dev Loop | `team_size` e OPCIONAL; sem ele, Dev Loop roda como antes |
| Custo | Auto-review + diagramas adicionam tokens ao pipeline | Mitigado por cache de verificacao e Docker AFK (melhor ROI) |

---

## Technical Context

| Aspect | Value | Notes |
|--------|-------|-------|
| **Deployment Location** | .claude/sdd/, .claude/agents/, .claude/commands/, .claude/dev/ | Workflow contracts, agent defs com frontmatter, command defs, Dev Loop templates |
| **KB Domains** | crewai (orquestracao multi-agente, circuit breaker) | CrewAI patterns: hierarchical process, fan-out/fan-in, escalation |
| **IaC Impact** | None (metodo de desenvolvimento, nao infraestrutura) | Sem Terraform/cloud. Apenas arquivos .md, .yaml, e agent definitions |

**Why This Matters:**

- **Location** → Todas as mudancas sao em .claude/ — nao afeta codigo de producao do projeto
- **KB Domains** → CrewAI patterns informam como orquestrar subagents paralelos
- **IaC Impact** → Zero risco de infraestrutura. Mudancas sao reversiveis via git

---

## Assumptions

| ID | Assumption | If Wrong, Impact | Validated? |
|----|------------|------------------|------------|
| A-001 | Subagents com `isolation: worktree` estao disponiveis na versao atual do Claude Code | Teria que usar background subagents sem isolation (conflitos de arquivo possiveis) | [ ] |
| A-002 | `memory: project` funciona entre sessoes para subagents customizados | Cada sessao comecaria do zero (perde acumulo de conhecimento) | [ ] |
| A-003 | Hooks de Stop no frontmatter de subagents funcionam como documentado | Auto-save de memoria nao funcionaria; teria que ser manual | [ ] |
| A-004 | Docker sandbox (`docker sandbox run claude`) suporta worktrees dentro do container | Teria que rodar sem Docker ou mapear worktrees manualmente | [ ] |
| A-005 | Background subagents podem rodar em paralelo sem limite hardcoded | Se houver limite (ex: max 3), afeta o numero de work groups simultaneos | [ ] |
| A-006 | O design-agent consegue particionar file manifests em work groups sem dependencias cruzadas | Particionamento ruim causa conflitos no merge; precisa de validacao manual | [ ] |

---

## Clarity Score Breakdown

| Element | Score (0-3) | Notes |
|---------|-------------|-------|
| Problem | 3 | Claro: SDD e Dev Loop sao sequenciais, falta paralelismo, 5 metricas especificas abaixo do ideal |
| Users | 3 | 4 personas identificadas com pain points especificos e mensuráveis |
| Goals | 3 | 16 goals com priorizacao MUST/SHOULD/COULD, cada um mensuravel |
| Success | 2 | 14 criterios, mas o criterio "< 50% do tempo sequencial" precisa de baseline real |
| Scope | 3 | 7 items explicitamente fora de escopo, constraints claros, retrocompatibilidade definida |
| **Total** | **14/15** | |

---

## Open Questions

1. **Baseline de velocidade**: Qual o tempo atual do /build sequencial para uma feature tipica? Precisamos medir para validar o criterio "< 50%".
2. **Limite de subagents paralelos**: Existe um limite hardcoded no Claude Code para background subagents simultaneos?
3. **Docker + worktree compatibility**: O `docker sandbox run claude` mapeia o diretorio de worktrees ou precisa de config adicional?

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-25 | define-agent | Versao inicial extraida do BRAINSTORM_AGENTSPEC_5.md |
| 1.1 | 2026-02-25 | define-agent | Adicionados: Docker sandbox no /build AFK, cache de verificacao, orientacao contextual |
| 1.2 | 2026-02-25 | ship-agent | Status updated to Shipped; archived to .claude/sdd/archive/AGENTSPEC_5/ |

---

## Deliverables Summary

### Arquivos a Criar/Modificar

| # | Arquivo | Acao | Descricao |
|---|--------|------|-----------|
| 1 | .claude/sdd/architecture/WORKFLOW_CONTRACTS.yaml | Modify | Atualizar para v5.0: parallel build, parallel design, auto-review, dashboard |
| 2 | .claude/agents/workflow/build-agent.md | Modify | Adicionar: worktree orchestration, Plan Mode enforcement, merge logic |
| 3 | .claude/agents/workflow/design-agent.md | Modify | Adicionar: background subagent spawning para research paralelo |
| 4 | .claude/agents/workflow/ship-agent.md | Modify | Adicionar: trigger /generate-diagrams antes de arquivar |
| 5 | .claude/agents/code-quality/code-reviewer.md | Modify | Adicionar frontmatter: memory: project, hooks |
| 6 | .claude/commands/workflow/build.md | Modify | Documentar fluxo paralelo, Docker AFK, Plan Mode |
| 7 | .claude/commands/workflow/design.md | Modify | Documentar research paralelo com subagents background |
| 8 | .claude/commands/dev/dev.md | Modify | Documentar campo team_size no PROMPT.md |
| 9 | .claude/dev/templates/PROMPT_TEMPLATE.md | Modify | Adicionar campo team_size e Config section |
| 10 | .claude/agents/dev/dev-loop-executor.md | Modify | Suportar team_size: spawnar N subagents paralelos |
| 11 | .claude/sdd/templates/BUILD_REPORT_TEMPLATE.md | Modify | Adicionar secao didatica por arquivo + atribuicao por work group |
| 12 | .claude/sdd/templates/DASHBOARD_TEMPLATE.md | Create | Template do dashboard de progresso por work group |
| 13 | .claude/sdd/templates/REVIEW_REPORT_TEMPLATE.md | Create | Template do auto-review report |
| 14 | .claude/sdd/templates/HISTORY_TEMPLATE.md | Create | Template do index de historico com timestamps |
| 15 | .claude/sdd/architecture/ARCHITECTURE.md | Modify | Atualizar diagrama de arquitetura com fluxo paralelo |
| 16 | .claude/CLAUDE.md | Modify | Atualizar secoes: Architecture Overview, Agent Usage, Commands, Scoring |

### Novos Conceitos Introduzidos

| Conceito | Descricao | Onde Vive |
|----------|-----------|-----------|
| **Work Group** | Conjunto de arquivos sem dependencias cruzadas que podem rodar em paralelo | DESIGN manifest: coluna "Work Group" |
| **Parallel Build** | /build decompoe manifest em work groups e spawna subagent por grupo em worktree isolado | build-agent.md, build.md |
| **Plan Mode por Subagent** | Subagent gera plano, lider aprova/rejeita, so entao implementa | build-agent.md (permissionMode: plan) |
| **Auto-Review** | code-reviewer roda automaticamente apos /build, gera REVIEW_REPORT | build.md (passo pos-build) |
| **Dashboard** | DASHBOARD_{FEATURE}.md com status em tempo real por work group | DASHBOARD_TEMPLATE.md |
| **Orientacao Contextual** | Ao final de cada fase: lista artefatos + paths + proximo comando | Todos os command .md files |
| **Docker AFK** | /build roda em Docker sandbox quando em modo AFK sem supervisao | build.md (opcao --docker) |
| **Cache de Verificacao** | Lint/typecheck so re-roda em arquivos que mudaram | build-agent.md (verificacao incremental) |
| **Explicacao Didatica** | BUILD_REPORT explica cada mudanca: o que, por que, como funciona | BUILD_REPORT_TEMPLATE.md |
| **Historico com Timestamps** | Nomes de artefatos incluem data/hora + HISTORY index file | Naming conventions no WORKFLOW_CONTRACTS |
| **team_size** | Campo no PROMPT.md que spawna N subagents paralelos no Dev Loop | PROMPT_TEMPLATE.md, dev-loop-executor.md |
| **Memory Persistente** | Subagents com `memory: project` acumulam conhecimento entre sessoes | Frontmatter dos agent .md files |

---

## Scoring Projetado

| Criterio | SDD 4.2 | AgentSpec 5.0 | Delta |
|----------|:---:|:---:|:---:|
| Facilidade de uso | 4 | **8** | +4 |
| Velocidade de entrega | 5 | **9** | +4 |
| Qualidade do output | 9 | **10** | +1 |
| Rastreabilidade | 10 | **10** | = |
| Paralelismo real | 2 | **9** | +7 |
| Recovery / resiliencia | 7 | **10** | +3 |
| Custo-beneficio | 6 | **7** | +1 |
| Escalabilidade | 7 | **9** | +2 |
| Acumulo de conhecimento | 9 | **10** | +1 |
| Flexibilidade | 5 | **8** | +3 |
| **MEDIA** | **6.4** | **9.0** | **+2.6 (+40%)** |

---

## Next Step

**Ready for:** `/design .claude/sdd/features/DEFINE_AGENTSPEC_5.md`
