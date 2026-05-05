# Startup Tracker 🚀

Plataforma profissional de acompanhamento de portfólio para aceleradoras e venture studios. Fonte única da verdade para status, risco e atualizações de startups — eliminando silos de informação espalhados em WhatsApp, e-mail e páginas de Notion.

Construído com Next.js 14, Supabase (Postgres + RLS) e guardrails forçados por Zod.

---

## Métricas Chave

| Métrica | Valor |
|---|---|
| Custo Mensal | **R$ 0,00** (Vercel Hobby + Supabase Free) |
| Latência de Interação | < 1s (Next.js Server Actions) |
| Segurança de Tipos | **100%** (TypeScript Estrito + Zod) |
| Modelo de Segurança | Row Level Security (RLS) forçado na camada de DB |

---

## Metodologia AI-First

| Componente | Método | Impacto |
|---|---|---|
| **Workflow SDD** | Spec-Driven Development | Abordagem Design-First (Brainstorm → Define → Design → Build). |
| **Diagram Agent** | Visualização Automática | Análise do código para gerar diagramas Excalidraw profissionais. |
| **Guardrails Zod** | Segurança de IA | Validação automática em runtime para evitar desvios de lógica. |

---

## Stack Tecnológica

| Camada | Tecnologia | Propósito |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | React Server Components para leitura ultra-rápida |
| **Estilização** | Tailwind CSS + Shadcn/UI | Design system premium com branding Bluefields |
| **Autenticação** | Supabase Auth (Magic Link) | Login seguro sem senha nível enterprise |
| **Banco de Dados** | Supabase Postgres | Armazenamento relacional com RLS e triggers |
| **Validação** | Zod | Guardrails em cada Server Action |

---

## Diagramas

Renderizados nativamente pelo GitHub. Versão técnica em Excalidraw em [`./diagrams/`](./diagrams/).

### 1. Arquitetura — visão geral

```mermaid
flowchart LR
    U([👤 <b>Usuário</b><br/>navegador])

    subgraph Vercel["▲ Vercel — onde a aplicação roda"]
        direction TB
        N["⚡ <b>Next.js 14</b><br/>páginas + formulários<br/><i>renderizados no servidor</i>"]
        Z["🛡️ <b>Zod</b><br/>confere todo dado"]
    end

    subgraph Supa["🟢 Supabase — backend pronto"]
        direction TB
        A["🔐 <b>Autenticação</b><br/>Magic Link / Senha"]
        DB[("🐘 <b>PostgreSQL</b><br/>+ Row Level Security")]
    end

    U <==>|HTTPS| N
    N --> Z
    Z ==>|grava| DB
    N ==>|lê| DB
    N <-.->|login| A
    A -.->|sessão| U

    classDef user fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef edge fill:#fff8e1,stroke:#f57f17,stroke-width:2px,color:#3e2723
    classDef back fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    class U user
    class N,Z edge
    class A,DB back
```

### 2. Fluxo de dados — três cenários reais

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 Usuário
    participant N as ⚡ Next.js
    participant Z as 🛡️ Zod
    participant A as 🔐 Supabase Auth
    participant DB as 🐘 PostgreSQL

    rect rgb(232, 245, 233)
    Note over U,DB: ① Login com Magic Link
    U->>N: Digita e-mail no /login
    N->>A: Pede magic link
    A-->>U: E-mail com link único
    U->>N: Clica no link
    N->>A: Troca código por sessão
    A-->>U: Cookie de sessão (JWT)
    end

    rect rgb(227, 242, 253)
    Note over U,DB: ② Ver dashboard
    U->>N: Acessa "/"
    N->>DB: Pede lista de startups
    DB-->>N: Devolve só o permitido (RLS)
    N-->>U: HTML pronto
    end

    rect rgb(255, 235, 238)
    Note over U,DB: ③ Adicionar atualização
    U->>N: Envia formulário
    N->>Z: Valida cada campo
    Z-->>N: ✅ OK
    N->>DB: Grava update + atualiza risco
    DB-->>N: Sucesso (RLS conferiu autor)
    N-->>U: Redireciona com dados frescos
    end
```

### 3. Modelo de dados — o que é guardado

```mermaid
erDiagram
    PROFILES ||--o{ STARTUPS : "🎯 lidera"
    PROFILES ||--o{ STARTUP_UPDATES : "✍️ escreve"
    STARTUPS ||--o{ STARTUP_UPDATES : "📋 recebe"

    PROFILES {
        uuid id PK
        text full_name "Nome completo"
        text email "E-mail de trabalho"
    }
    STARTUPS {
        uuid id PK
        text name "Nome da startup"
        text segment "Segmento"
        enum phase "Ideação → Escala"
        enum risk_level "🟢 / 🟡 / 🔴"
        uuid responsible_id FK "Líder Bluefields"
        timestamp updated_at "Última atualização"
    }
    STARTUP_UPDATES {
        uuid id PK
        uuid startup_id FK
        uuid author_id FK
        text content "Progresso"
        text blockers "Impedimentos"
        text next_steps "Próximos passos"
        enum risk_level "Risco no momento"
        timestamp created_at "Quando"
    }
```

---

## Primeiros Passos

```bash
# 1. Instalar dependências
npm install

# 2. Configuração de Ambiente
cp .env.example .env.local

# 3. Configuração do Banco
# Execute a migração no SQL Editor do Supabase:
# cat supabase/migrations/001_initial_schema.sql

# 4. Iniciar Desenvolvimento
npm run dev
```

---

## Documentação

Detalhamento técnico completo disponível na pasta `/docs`:

| Documento | Descrição |
|---|---|
| [PRD](docs/PRD.md) | Problema, histórias de usuário e critérios de aceitação. |
| [Arquitetura](docs/ARCHITECTURE.md) | Modelo de segurança, fluxo de dados e stack técnica. |
| [Uso de IA](docs/AI_USAGE.md) | Log do processo de pair programming humano-IA. |
| [Plano de Execução](docs/EXECUTION_PLAN.md) | Cronograma e retrospectiva. |
