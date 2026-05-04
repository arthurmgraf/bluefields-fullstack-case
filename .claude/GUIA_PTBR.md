# Guia Completo do Template — pt-br

> Tudo que você precisa saber para usar este template do Claude Code.

---

## O que é este template?

Este é um template de Claude Code pré-configurado com:
- **36+ agentes especializados** que o Claude usa automaticamente
- **2 workflows de desenvolvimento** (Dev Loop e SDD)
- **48 skills** que ensinam o Claude a seguir boas práticas
- **7 MCP Servers** que conectam o Claude a ferramentas externas
- **14 slash commands** para disparar workflows estruturados

O objetivo é transformar o Claude de um assistente genérico em um engenheiro sênior que conhece seu projeto.

---

## Como adaptar para o seu projeto (passo a passo)

### 1. Copie o template

```bash
cp -r template_claude_code/.claude/ seu-projeto/.claude/
cp template_claude_code/.mcp.json seu-projeto/.mcp.json
```

### 2. Preencha o CLAUDE.md

Abra `.claude/CLAUDE.md` e substitua os dados do projeto MR. HEALTH pelos dados do seu projeto:

- Nome e descrição do projeto
- Problema de negócio e solução
- Diagrama de arquitetura (ASCII)
- Estrutura de pastas
- Stack tecnológica e padrões de código
- Variáveis de ambiente necessárias

> O `CLAUDE.md` é carregado automaticamente pelo Claude em toda conversa. É a "memória" do projeto.

### 3. Configure os MCP Servers

Edite `.mcp.json` na raiz do projeto:

| Server | Precisa de API key? | Serve para |
|--------|---------------------|------------|
| `context7` | Não | Documentação atualizada de libs (ex: Next.js, Pydantic) |
| `sequential-thinking` | Não | Raciocínio em cadeia para problemas complexos |
| `memory` | Não | Memória persistente entre sessões (grafo de conhecimento) |
| `playwright` | Não | Automação de browser e testes E2E |
| `github` | Sim (`GITHUB_TOKEN`) | PRs, issues, commits via Claude |
| `brave-search` | Sim (`BRAVE_API_KEY`) | Busca na web (2000/mês grátis) |

Para setar as chaves:
```bash
export GITHUB_TOKEN="ghp_..."
export BRAVE_API_KEY="..."
```

### 4. Crie agentes de domínio

Para o seu projeto específico, adicione agentes em `.claude/agents/domain/`:

```bash
cp .claude/agents/_template.md.example .claude/agents/domain/meu-especialista.md
```

### 5. Instale skills extras (opcional)

```bash
# Exemplos populares:
npx add-skill wshobson/agents          # Python, testing, backend
npx add-skill vercel-labs/agent-skills # React, frontend
npx add-skill obra/superpowers         # TDD, git worktrees
```

---

## Os dois workflows de desenvolvimento

### Workflow 1: Dev Loop — para tarefas simples (1-4 horas)

Use quando a tarefa é clara e você quer executar logo.

```bash
# Opção A: deixa o Claude te guiar fazendo perguntas
/dev "quero criar um parser de CSV"

# Opção B: executa um PROMPT.md pronto
/dev tasks/PROMPT_CSV_PARSER.md

# Opção C: retoma uma sessão interrompida
/dev tasks/PROMPT_CSV_PARSER.md --resume
```

**Como funciona:**

```
/dev "descrição"
    │
    ▼
PROMPT CRAFTER (faz perguntas, explora o codebase)
    │ gera
    ▼
PROMPT.md (arquivo com tarefas priorizadas)
    │
    ▼
DEV LOOP EXECUTOR (executa tarefa por tarefa com verificação)
    │
    ▼
EXIT_COMPLETE
```

**Prioridade das tarefas no PROMPT.md:**

| Símbolo | Prioridade | Execução |
|---------|-----------|----------|
| 🔴 RISKY | Primeiro | Problemas difíceis, fail-fast |
| 🟡 CORE | Segundo | Implementação principal |
| 🟢 POLISH | Por último | Limpeza, otimização |

**Modos de execução:**

| Modo | Comportamento |
|------|--------------|
| `hitl` (padrão) | Para para você revisar em pontos importantes |
| `afk` | Autônomo — roda tudo sem pausar |

**Recovery:** Se a sessão for interrompida, rode com `--resume` e o executor retoma de onde parou usando o arquivo `PROGRESS.md`.

**Docker AFK (sandbox isolado):** Para rodar em modo totalmente autônomo com sandbox, inicie o Claude Code com a flag `--sandbox` no terminal. Isso faz toda execução de bash rodar dentro de um container Docker:

```bash
# Requer Docker instalado e rodando
claude --sandbox
# Depois, dentro do Claude Code:
/dev tasks/PROMPT_MEU_TASK.md --mode afk
```

O campo `sandbox: docker` no PROMPT.md é um sinal de intenção — indica que a task foi projetada para rodar em sandbox. A ativação real é via `claude --sandbox` no CLI.

---

### Workflow 2: SDD (AgentSpec 5.0) — para features complexas (multi-dia)

Use quando a feature precisa de rastreabilidade, múltiplos componentes ou qualidade enterprise.

**Pipeline de 5 fases:**

```
/brainstorm → /define → /design → /build → /ship
  (Opcional)   (O quê)   (Como)   (Código) (Arquiva)
```

#### Fase 0: `/brainstorm` (opcional)

Explore a ideia antes de definir requisitos. Use quando a ideia ainda é vaga.

```bash
/brainstorm "sistema de notificações em tempo real"
```

O agente vai:
1. Fazer perguntas uma de cada vez
2. Apresentar 2-3 abordagens com trade-offs
3. Aplicar YAGNI (remover o que não é necessário)
4. Gerar rascunho de requisitos para o `/define`

**Arquivo gerado:** `.claude/sdd/features/BRAINSTORM_NOME.md`

#### Fase 1: `/define`

Captura e valida os requisitos formalmente.

```bash
/define .claude/sdd/features/BRAINSTORM_NOME.md
# ou direto:
/define "construir uma API REST para usuários"
```

**Arquivo gerado:** `.claude/sdd/features/DEFINE_NOME.md` com:
- Problema e usuários-alvo
- Critérios de sucesso (mensuráveis)
- Testes de aceite (Given/When/Then)
- O que está fora do escopo

#### Fase 2: `/design`

Cria o design técnico completo. No AgentSpec 5.0, subagentes rodam em background pesquisando o codebase e a KB em paralelo.

```bash
/design .claude/sdd/features/DEFINE_NOME.md
```

**Arquivo gerado:** `.claude/sdd/features/DESIGN_NOME.md` com:
- Diagrama de arquitetura (ASCII)
- Decisões técnicas com justificativa
- Manifesto de arquivos (todos os arquivos a criar)
- Padrões de código prontos para usar

#### Fase 3: `/build`

Implementa o código seguindo o DESIGN. No AgentSpec 5.0, decompõe o manifesto em grupos de trabalho e executa em paralelo via git worktrees.

```bash
/build .claude/sdd/features/DESIGN_NOME.md
```

**O que é gerado:**
- Código conforme especificado no manifesto
- `.claude/sdd/reports/BUILD_REPORT_NOME.md`
- Após o build: code-reviewer roda automaticamente

#### Fase 4: `/ship`

Arquiva tudo com lições aprendidas e limpa os arquivos de trabalho.

```bash
/ship .claude/sdd/features/DEFINE_NOME.md
```

**O que é gerado em** `.claude/sdd/archive/NOME/`:
- `SHIPPED_DATA.md` — resumo, métricas, lições aprendidas
- `HISTORY_NOME.md` — índice cronológico de todos os artefatos
- Cópias de todos os documentos da feature

#### `/iterate` — para mudanças no meio do fluxo

Se precisar alterar algo após ter avançado:

```bash
/iterate DEFINE_NOME.md "adicionar suporte a exportação CSV"
/iterate DESIGN_NOME.md "os componentes precisam ser independentes"
```

---

## Slash commands disponíveis

| Comando | Para que serve |
|---------|---------------|
| `/brainstorm` | Explorar ideia vagamente antes de definir requisitos |
| `/define` | Capturar e validar requisitos formalmente |
| `/design` | Criar design técnico com diagrama e manifesto de arquivos |
| `/build` | Implementar o código conforme o design |
| `/ship` | Arquivar feature completa com lições aprendidas |
| `/iterate` | Atualizar documentos SDD no meio do processo |
| `/dev` | Dev Loop para tarefas simples/médias |
| `/review` | Code review estruturado |
| `/create-kb` | Criar uma base de conhecimento sobre uma tecnologia |
| `/create-pr` | Criar Pull Request |
| `/memory` | Salvar insights importantes da sessão atual |
| `/sync-context` | Atualizar o CLAUDE.md com padrões do codebase |
| `/readme-maker` | Gerar README.md completo analisando o projeto |
| `/generate-diagrams` | Gerar diagramas de arquitetura (Excalidraw) |
| `/setup-project` | Adaptar o template para um novo projeto |

### Skills (também chamados via `/`)

| Skill | Como chamar |
|-------|------------|
| Revisão de segurança (OWASP) | Automático ao revisar código sensível |
| Code review com severidade | `/code-review` |
| Commit no formato Conventional | `/commit` |
| Revisão de Pull Request | `/pr-review` |

---

## Os 36 agentes especializados

Os agentes são subprocessos que o Claude invoca automaticamente via `Task tool`. Você não precisa chamá-los diretamente — o Claude decide quando delegar.

### Por categoria:

**Qualidade de código (7):**
- `code-reviewer` — revisão com scoring
- `code-cleaner` — remove comentários excessivos, aplica DRY
- `code-simplifier` — simplifica mantendo funcionalidade
- `code-documenter` — gera documentação e README
- `dual-reviewer` — revisão dupla (CodeRabbit + Claude)
- `python-developer` — código Python com type hints e dataclasses
- `test-generator` — testes pytest com fixtures e edge cases

**Workflow SDD (6):**
- `brainstorm-agent`, `define-agent`, `design-agent`, `build-agent`, `ship-agent`, `iterate-agent`

**Dev Loop (2):**
- `prompt-crafter` — cria o PROMPT.md fazendo perguntas
- `dev-loop-executor` — executa as tarefas com recovery

**Data Engineering (8):**
- Spark (performance, troubleshoot, streaming)
- Lakeflow/DLT (arquitetura, expert, pipeline-builder)
- Medallion Architecture

**AI/ML (4):**
- `llm-specialist` — prompts e chain-of-thought
- `genai-architect` — sistemas multi-agente
- `ai-prompt-specialist` — extração estruturada
- `ai-data-engineer` — pipelines de dados

**Comunicação (3):**
- `adaptive-explainer` — explica para qualquer audiência
- `meeting-analyst` — extrai decisões e ações de reuniões
- `the-planner` — planejamento estratégico

**Exploração (2):**
- `codebase-explorer` — analisa codebase com Executive Summary
- `kb-architect` — cria domínios de Knowledge Base

**Domain (customizável):**
- Adicione os seus em `.claude/agents/domain/`

---

## Knowledge Base (KB)

A KB é uma coleção de documentos que ensinam o Claude sobre tecnologias específicas do seu projeto.

### Criar uma KB:

```bash
/create-kb "Redis"
/create-kb "PostgreSQL"
/create-kb "Docker"
```

O `kb-architect` vai criar a estrutura em `.claude/kb/{domínio}/`:

```
.claude/kb/redis/
├── index.md           # Visão geral do domínio
├── quick-reference.md # Cheat sheet
├── concepts/          # Conceitos fundamentais
├── patterns/          # Padrões de implementação
└── specs/             # Especificações YAML (opcional)
```

### KBs já criadas neste template:
- `crewai/` — Orquestração multi-agente
- `gcp/` — Google Cloud Platform
- `gemini/` — Integração com modelos Gemini
- `langfuse/` — Observabilidade de LLMs
- `openrouter/` — Roteamento de modelos AI
- `pydantic/` — Validação de dados Python

---

## O que funciona de forma autônoma?

Ao abrir o Claude Code neste template, ele automaticamente:

1. Lê o `CLAUDE.md` e entende o contexto do projeto
2. Reconhece todos os 36 agentes e delega quando necessário
3. Usa os MCP Servers para buscar documentação, gerenciar PRs, etc.
4. Aplica `security-guidance` ao revisar código sensível
5. Carrega skills relevantes conforme o contexto da tarefa

### O que você precisa disparar manualmente:

| Ação | Como disparar |
|------|--------------|
| Features com SDD | `/brainstorm` → `/define` → `/design` → `/build` → `/ship` |
| Tarefas estruturadas | `/dev "descrição"` |
| Reviews explícitos | `/code-review`, `/pr-review`, `/commit` |
| Gestão de contexto | `/memory`, `/sync-context`, `/create-kb` |

---

## Estrutura de pastas do `.claude/`

```
.claude/
├── CLAUDE.md              ← Contexto do projeto (lido automaticamente)
├── GUIA_PTBR.md           ← Este arquivo
├── SETUP.md               ← Guia de setup em inglês
├── COMMANDS_REFERENCE.md  ← Referência de todos os comandos e skills
├── settings.json          ← Permissões de ferramentas
│
├── agents/                ← 36+ agentes especializados
│   ├── workflow/          ← SDD: brainstorm, define, design, build, ship, iterate
│   ├── dev/               ← Dev Loop: prompt-crafter, dev-loop-executor
│   ├── code-quality/      ← review, cleaner, simplifier, documenter, etc.
│   ├── data-engineering/  ← Spark, Lakeflow, Medallion
│   ├── ai-ml/             ← LLM, GenAI, prompt engineering
│   ├── communication/     ← explainer, meeting-analyst, planner
│   ├── exploration/       ← codebase-explorer, kb-architect
│   └── domain/            ← Seus agentes específicos do projeto
│
├── commands/              ← Definições dos slash commands
│   ├── workflow/          ← /brainstorm, /define, /design, /build, /ship, /iterate
│   ├── dev/               ← /dev
│   ├── core/              ← /memory, /sync-context, /readme-maker, /setup-project
│   ├── review/            ← /review
│   ├── knowledge/         ← /create-kb
│   └── workflow/          ← /create-pr, /generate-diagrams
│
├── skills/                ← 48 skills instaladas
│   └── (cada skill em sua própria pasta com SKILL.md)
│
├── kb/                    ← Knowledge Base
│   ├── crewai/
│   ├── gcp/
│   ├── gemini/
│   └── ...
│
├── sdd/                   ← Artefatos do workflow SDD
│   ├── features/          ← Documentos ativos (BRAINSTORM, DEFINE, DESIGN)
│   ├── reports/           ← BUILD_REPORT, REVIEW_REPORT, DASHBOARD
│   ├── archive/           ← Features concluídas com SHIPPED + HISTORY
│   ├── templates/         ← Templates dos documentos
│   └── architecture/      ← WORKFLOW_CONTRACTS.yaml, ARCHITECTURE.md
│
└── dev/                   ← Artefatos do Dev Loop
    ├── tasks/             ← Seus PROMPT.md files
    ├── progress/          ← PROGRESS.md (recovery automático)
    ├── logs/              ← LOG.md (registro de execução)
    ├── templates/         ← PROMPT_TEMPLATE.md, exemplos
    └── examples/          ← Exemplos reais de uso
```

---

## Quando usar Dev Loop vs SDD?

| Situação | Use |
|----------|-----|
| Script rápido, utilitário | `/dev` |
| Protótipo, POC | `/dev` |
| Feature única isolada | `/dev` |
| Criar/expandir Knowledge Base | `/dev` |
| Feature com múltiplos componentes | SDD (`/brainstorm` → `/ship`) |
| Sistema em produção | SDD |
| Precisa de rastreabilidade/auditoria | SDD |
| Projeto em equipe | SDD |

---

## CodeMap Hotel — Visualização em tempo real

O CodeMap transforma a atividade dos agentes em um hotel pixel-art. Cada agente do Claude Code vira um personagem que anda entre salas (pastas), senta em mesas (arquivos) e exibe balões de fala com o que está fazendo.

### O que você vê

| Visual | Significado |
|--------|-------------|
| Personagem andando | Agente navegando entre arquivos |
| Tela amarela acesa | Lendo um arquivo |
| Tela verde acesa | Escrevendo/editando código |
| Balão de fala | Ferramenta atual (Read, Write, Bash...) |
| Personagem pulando | Claude esperando sua resposta (stuck!) |
| Cafeteria | Agentes ociosos |

### Iniciar o CodeMap

O CodeMap já está instalado e configurado neste projeto. Para rodar:

```bash
# Na raiz do projeto
bash start-codemap.sh
```

Depois abra no browser: **http://localhost:5173/hotel**

Deixe o servidor rodando em um terminal separado enquanto usa o Claude Code.

### Como foi configurado

Os hooks já estão em `.claude/settings.local.json` (não commitado no git). Eles enviam eventos para o servidor CodeMap a cada Read/Write/Edit do Claude.

Se precisar reconfigurar (ex: moveu a pasta `codemap-tool/`):

```bash
# Reinstala os hooks
node codemap-tool/bin/setup.js setup
```

### Requisitos

- Node.js instalado
- `jq` instalado (já instalado via winget neste projeto)
- `curl` disponível no PATH (já disponível)
- Pasta `codemap-tool/` presente (não é commitada no git — clone novamente se necessário)

### Reinstalação (se necessário)

```bash
# Clone o repositório
git clone https://github.com/jamsusmaximus/codemap codemap-tool

# Instale as dependências
cd codemap-tool && npm install && cd ..

# Configure os hooks no projeto
node codemap-tool/bin/setup.js setup
```

---

## Fluxo recomendado para um projeto novo

```bash
# 1. Configure o template
/setup-project
# (segue instruções interativas)

# 2. Sincronize o contexto do codebase existente
/sync-context

# 3. Para features complexas: inicie o SDD
/brainstorm "minha nova feature"

# 4. Para tarefas rápidas: use o Dev Loop
/dev "adicionar validação no endpoint de login"

# 5. Salve insights importantes
/memory
```

---

## Referências internas

| Arquivo | Conteúdo |
|---------|----------|
| `.claude/CLAUDE.md` | Contexto completo do projeto |
| `.claude/SETUP.md` | Guia de setup detalhado (inglês) |
| `.claude/COMMANDS_REFERENCE.md` | Todos os comandos, skills, agentes e MCPs |
| `.claude/sdd/_index.md` | Documentação do workflow SDD |
| `.claude/dev/_index.md` | Documentação do Dev Loop |
| `.claude/agents/domain/_README.md` | Como criar agentes de domínio |
| `.claude/kb/_README.md` | Como estruturar uma KB |
| `.claude/skills/_README.md` | Como criar skills customizadas |
| `start-codemap.sh` | Inicia o CodeMap Hotel (visualização dos agentes) |
