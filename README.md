# Startup Tracker — Bluefields AI-First MVP

![CI](https://img.shields.io/badge/CI-passou-brightgreen)
![Next.js](https://img.shields.io/badge/next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth--DB-green)
![Vercel Cost](https://img.shields.io/badge/Vercel%20cost-R%240.00%2Fm%C3%AAs-brightgreen)

Plataforma profissional de acompanhamento de portfólio para aceleradoras e venture studios. Fonte única da verdade para status, risco e atualizações de startups — eliminando silos de informação espalhados em WhatsApp, e-mail e páginas de Notion.

Construído como um case técnico para a **Bluefields**, seguindo um fluxo de trabalho rigoroso de desenvolvimento AI-First.

---

## Métricas Chave

| Métrica | Valor |
|---|---|
| Custo Mensal | **R$ 0,00** (Vercel Hobby + Supabase Free) |
| Latência de Interação | < 1s (Next.js Server Actions) |
| Segurança de Tipos | **100%** (TypeScript Estrito + Zod) |
| Modelo de Segurança | Row Level Security (RLS) forçado na camada de DB |
| Código Gerado por IA | **~85%** (Claude Code + Revisão humana constante) |
| Integridade de Dados | Postgres ACID + Validação Zod |

---

## Arquitetura

```
USUÁRIO (Browser)  ──HTTPS──>  Vercel Edge (Next.js 14)  ──Server Action──>  Supabase (Postgres)
                                     |                                         |
                                Middleware                                  Política RLS
                            (Filtro de Sessão)                          (Barreira de Auth)
```

### Stack Tecnológica

| Camada | Tecnologia | Propósito |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | React Server Components para leitura rápida e SEO |
| **Estilização** | Tailwind CSS + Shadcn/UI | Sistema de design premium com branding Bluefields |
| **Autenticação** | Supabase Auth (Magic Link) | Login sem senha, seguro e de nível enterprise |
| **Banco de Dados** | Supabase Postgres | Armazenamento relacional com RLS e triggers |
| **Validação** | Zod | Guardrails em tempo de execução em todas as Server Actions |
| **Deploy** | Vercel Edge | Distribuição global com latência mínima |

### Decisões de Design Chave

| Decisão | Escolha | Por que? |
|---|---|---|
| Busca de Dados | RSC (Server Components) | Zero JS no cliente para o render inicial, FCP mais rápido |
| Segurança | RLS-only | Segurança garantida no banco; sigilo da chave do app é secundário |
| Gestão de Estado | URL-driven + Actions | Estado mínimo no cliente, comportamento nativo de forms |
| Padrão de Auth | Magic Link | Reduz atrito para gestores de portfólio; alta segurança |
| UX | Shadcn/UI | Componentes acessíveis e premium com tema customizado |

---

## Metodologia AI-First

Este projeto foi construído usando um modelo estrito de parceria IA-Humano, utilizando padrões avançados de orquestração para garantir engenharia de alta qualidade.

| Componente | Método | Impacto |
|---|---|---|
| **Workflow SDD** | Spec-Driven Development | **Abordagem Design-First.** Funcionalidades são desenhadas em `.claude/sdd/` antes de qualquer linha de código. |
| **Diagram Agent** | Visualização Automática | **Documentação viva.** Um agente especializado analisa o código para gerar e sincronizar diagramas Excalidraw automaticamente. |
| **Guardrails Zod** | Segurança de IA | **Barreira de confiança zero.** Validação automática em cada entrada para evitar "alucinações" de lógica da IA. |

---

## Modelo de Dados

### Esquema Relacional

```
                     profiles (Usuários)
                        |
        author_id <── startup_updates ──> startup_id
                                              |
                                       responsible_id
```

| Tabela | Propósito | Controle de Acesso (RLS) |
|---|---|---|
| `profiles` | Armazena metadados e nomes de usuários | Usuários Autenticados (Leitura/Edição Própria) |
| `startups` | Core do acompanhamento (nome, fase, risco) | Usuários Autenticados (Leitura/Escrita) |
| `startup_updates` | Log cronológico imutável de atualizações | Apenas o Autor (Inserção) |

---

## Diagramas

Visualizações técnicas dos fluxos do sistema e barreiras de segurança:

### 1. Arquitetura do Sistema
Visão macro do fluxo de requisições e infraestrutura.
![Arquitetura do Sistema](./startup-tracker/diagrams/architecture.png)

### 2. Fluxo de Dados
Fluxos detalhados para Leitura (RSC), Escrita (Actions) e Auth (Magic Link).
![Fluxo de Dados](./startup-tracker/diagrams/data-flow.png)

### 3. Modelo de Entidade Relacionamento (ER)
Esquema do banco de dados com chaves estrangeiras e anotações de políticas RLS.
![Modelo de Dados](./startup-tracker/diagrams/data-model.png)

---

## Estrutura do Repositório

```
bluefields-fullstack-case/
├── startup-tracker/               # Pasta Principal da Aplicação
│   ├── src/                       # Next.js App Router (Páginas e Actions)
│   ├── components/                # Componentes UI (Tema Bluefields Premium)
│   ├── lib/                       # Configurações de Supabase e Zod
│   ├── docs/                      # Documentação Técnica Detalhada
│   │   ├── PRD.md                 # 1. Documento de Requisitos (PRD)
│   │   ├── EXECUTION_PLAN.md      # 2. Plano Estratégico de Execução
│   │   ├── AI_USAGE.md            # 4. Log de Uso e Revisão de IA ⭐
│   │   └── ARCHITECTURE.md        # Deep-dive em Arquitetura Técnica
│   ├── diagrams/                  # PNGs e Fontes do Excalidraw
│   ├── scripts/                   # Scripts operacionais e de demo
│   └── .claude/skills/            # 5. Skill Reutilizável de Revisão de Código
└── .claude/sdd/                   # Rastreabilidade SDD (Brainstorm → Design)
```

---

## Primeiros Passos

### Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- [Conta no Supabase](https://supabase.com)

### Configuração Rápida

```bash
# 1. Clonar e instalar
git clone https://github.com/arthurmgraf/bluefields-fullstack-case.git
cd bluefields-fullstack-case/startup-tracker
npm install

# 2. Configuração de Ambiente
cp .env.example .env.local

# 3. Iniciar Desenvolvimento
npm run dev
```

---

## Análise de Custos

| Serviço | Camada | Uso | Custo |
|---|---|---|---|
| **Vercel** | Hobby | Hospedagem App + Edge Functions | R$ 0,00 |
| **Supabase DB** | Free | 500MB Postgres | R$ 0,00 |
| **Supabase Auth** | Free | Até 50k MAU | R$ 0,00 |

**Total: R$ 0,00/mês.** Utilizando camadas gratuitas permanentes para operações de nível enterprise sem custo.

---

## Índice de Entregáveis do Case

| Entregável | Localização |
|---|---|
| **1. PRD** | [`docs/PRD.md`](startup-tracker/docs/PRD.md) |
| **2. Plano de Execução** | [`docs/EXECUTION_PLAN.md`](startup-tracker/docs/EXECUTION_PLAN.md) |
| **3. MVP Funcional** | [Demo Ao Vivo](https://bluefields-fullstack-case.vercel.app) |
| **4. Doc de Uso de IA** | [`docs/AI_USAGE.md`](startup-tracker/docs/AI_USAGE.md) |
| **5. Skill Reutilizável** | [`.claude/skills/code-review/SKILL.md`](startup-tracker/.claude/skills/code-review/SKILL.md) |

---

## Autor

**Arthur Maia Graf**

[LinkedIn](https://linkedin.com) | [GitHub](https://github.com/arthurmgraf)
