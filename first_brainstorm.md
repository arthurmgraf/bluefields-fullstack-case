# 🔵 Bluefields Case — Brainstorm & Planejamento SDD

## 📋 Sumário Executivo

**Vaga:** Fullstack Developer (AI-First) — Bluefields (PJ, Remoto)
**Desafio:** Construir um MVP fullstack para acompanhamento de startups aceleradas
**Tempo estimado:** 6-10h | **Método:** Spec Driven Development via Claude Code
**Repo:** [bluefieldsdev/bluefields-vagas](https://github.com/bluefieldsdev/bluefields-vagas)

---

## 1. 🎯 Análise da Vaga vs. Desafio — O que eles realmente querem ver

### O Perfil que Buscam
| Competência | Como demonstrar no case |
|---|---|
| **AI-First mindset** | Todo o fluxo documentado: PRD → specs → code gerado → review → iterate |
| **Ponta a ponta** | Do PRD ao deploy público funcional |
| **Arquitetura sólida** | Patterns claros mesmo em MVP (separation of concerns, tipagem, etc.) |
| **Velocidade com qualidade** | MVP funcional em 6-10h sem gambiarras estruturais |
| **Guardrails de IA** | Templates de prompts, skills reutilizáveis, testes mínimos |
| **Documentação pragmática** | Decisões técnicas claras, não verbosas |

### Critérios de Avaliação (explícitos na vaga)
1. **Capacidade de estruturar um problema cru** → PRD bem feito
2. **Tradução negócio → produto** → Features prioritizadas com justificativa
3. **Uso prático e crítico de IA** → Logs de como usou, o que revisou, o que descartou
4. **Entrega ponta a ponta** → App funcional + deployed
5. **Clareza na documentação** → READMEs, decision logs
6. **Critério técnico** → Qualidade, segurança, débito técnico controlado

---

## 2. 🧩 Decomposição do Problema de Negócio

### Dor Central
> A Bluefields acompanha dezenas de startups em paralelo e **não tem visibilidade centralizada** do status de cada uma. Informação está fragmentada em WhatsApp, email, Notion, Google Drive e "na cabeça das pessoas".

### Consequências da dor
- Time perde tempo buscando informação
- Startups em dificuldade são percebidas tarde demais
- Sem priorização baseada em dados

### Pergunta-chave a responder
> Como ter, em um único lugar, visão clara e atualizada do progresso, riscos e próximos passos de cada startup?

---

## 3. 🏗️ Requisitos do MVP — Mapeados e Priorizados

### Must Have (escopo do desafio)
| # | Feature | Complexidade | Valor |
|---|---|---|---|
| 1 | Cadastro de startups (nome, segmento, fase, responsável) | Baixa | Alto |
| 2 | Updates periódicos por startup (o que aconteceu, bloqueios, próximos passos) | Média | Alto |
| 3 | Indicador de risco (verde/amarelo/vermelho) | Baixa | Alto |
| 4 | Dashboard consolidado (visão geral) | Média | Muito Alto |
| 5 | Autenticação funcional | Média | Alto |
| 6 | Persistência real de dados | Média | Alto |
| 7 | Deploy público via link | Baixa | Alto |

### Explicitamente FORA do escopo
- ❌ UI polida/design elaborado (funcional é suficiente)
- ❌ Integrações WhatsApp/Slack
- ❌ IA embutida no produto (IA é no **processo**, não no produto)
- ❌ Notificações/emails

### Nice-to-have (diferenciais para brilhar)
- 📊 Filtros e busca no dashboard
- 📈 Histórico visual de evolução de risco
- 🔐 Role-based access (admin vs viewer)
- 📝 Markdown nos updates

---

## 4. ⚙️ Decisões de Stack — Justificativas

### Stack Escolhida

```
┌─────────────────────────────────────────┐
│           FRONTEND                       │
│  Next.js 14+ (App Router)               │
│  React + TypeScript                      │
│  Shadcn/UI (componentes acessíveis)     │
│  Tailwind CSS                            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           BACKEND / API                  │
│  Next.js API Routes (Route Handlers)     │
│  Server Actions (para mutations)         │
│  Zod (validação de schemas)              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           DATA / AUTH                    │
│  Supabase (PostgreSQL + Auth + RLS)      │
│  Row Level Security policies             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           DEPLOY                         │
│  Vercel (zero-config com Next.js)        │
└─────────────────────────────────────────┘
```

### Justificativas

| Escolha | Por quê |
|---|---|
| **Next.js (App Router)** | Stack sugerida pela Bluefields; SSR + API routes no mesmo projeto; deploy trivial na Vercel |
| **TypeScript** | Tipagem = guardrail de qualidade; IA gera código mais confiável com tipos |
| **Supabase** | Auth pronto, Postgres, RLS = segurança no nível do banco; SDK excelente |
| **Shadcn/UI** | Componentes acessíveis, customizáveis, sem vendor lock; copiar/colar, não npm install |
| **Tailwind** | Velocidade de prototipação; consistência visual sem CSS custom |
| **Vercel** | Deploy automático via git push; preview deploys; zero config com Next.js |
| **Zod** | Validação de schemas no server e client; runtime type safety |

---

## 5. 📐 Arquitetura de Dados — Schema Inicial

```sql
-- Tabela de perfis (extensão do auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Startups aceleradas
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  segment TEXT NOT NULL,           -- ex: fintech, healthtech, edtech
  phase TEXT NOT NULL,             -- ex: ideação, validação, tração, escala
  risk_level TEXT DEFAULT 'green'  -- green, yellow, red
    CHECK (risk_level IN ('green', 'yellow', 'red')),
  responsible_id UUID REFERENCES profiles(id),
  description TEXT,
  founded_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Updates periódicos
CREATE TABLE startup_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,           -- o que aconteceu
  blockers TEXT,                   -- bloqueios atuais
  next_steps TEXT,                 -- próximos passos
  risk_level TEXT DEFAULT 'green'  -- snapshot do risco neste update
    CHECK (risk_level IN ('green', 'yellow', 'red')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies (Segurança)
```sql
-- Todos autenticados podem ler
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read" ON startups
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas admins podem inserir/editar
CREATE POLICY "admin_write" ON startups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 6. 🖼️ Wireframe Mental — Telas do MVP

### Tela 1: Login
- Email + senha via Supabase Auth
- Redirect para dashboard após login

### Tela 2: Dashboard (tela principal)
```
┌──────────────────────────────────────────────┐
│  🔵 Bluefields Tracker          [Logout]     │
├──────────────────────────────────────────────┤
│                                              │
│  Resumo:  12 startups | 🟢 8  🟡 3  🔴 1    │
│                                              │
│  [Filtro: Fase ▾] [Filtro: Risco ▾] [Busca] │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Startup A│ │ Startup B│ │ Startup C│     │
│  │ Fintech  │ │ EdTech   │ │ HealthT  │     │
│  │ 🟢 Traçao│ │ 🟡 Valid.│ │ 🔴 Ideaç│     │
│  │ Resp: Ana│ │ Resp: Bob│ │ Resp: Car│     │
│  │ Últ upd: │ │ Últ upd: │ │ Últ upd: │     │
│  │ 2 dias   │ │ 5 dias   │ │ 12 dias  │     │
│  └──────────┘ └──────────┘ └──────────┘     │
└──────────────────────────────────────────────┘
```

### Tela 3: Detalhe da Startup
```
┌──────────────────────────────────────────────┐
│  ← Voltar    Startup Alpha    [Editar] 🟡    │
├──────────────────────────────────────────────┤
│  Segmento: Fintech | Fase: Validação         │
│  Responsável: Ana Silva                       │
│  Fundação: Mar 2025                           │
├──────────────────────────────────────────────┤
│  📋 Updates                    [+ Novo Update]│
│                                              │
│  ┌─ 28/04/2025 ─── por Ana ── 🟡 ──────────┐│
│  │ Progresso: Fecharam primeiro cliente      ││
│  │ Bloqueios: Regulação bancária travada     ││
│  │ Próximos: Reunião com advogado regulatório││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌─ 21/04/2025 ─── por Bob ── 🟢 ──────────┐│
│  │ Progresso: MVP em testes beta             ││
│  │ Bloqueios: Nenhum                         ││
│  │ Próximos: Onboarding primeiro cliente     ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

### Tela 4: Criar/Editar Startup (modal ou página)
### Tela 5: Criar Update (modal ou página)

---

## 7. 🚀 Entregáveis Mapeados

A vaga pede **5 entregáveis explícitos**. Aqui está como cada um se materializa:

| # | Entregável | Formato | Arquivo |
|---|---|---|---|
| 1 | **PRD enxuto** | Markdown | `docs/PRD.md` |
| 2 | **Plano de execução com IA** | Markdown | `docs/EXECUTION_PLAN.md` |
| 3 | **MVP fullstack funcional** | Next.js app deployed | Código + URL Vercel |
| 4 | **Documentação de uso de IA** | Markdown | `docs/AI_USAGE.md` |
| 5 | **Skill reutilizável** | Script/Config | `skills/code-review-skill.md` ou `.claude/` |

---

## 8. 📖 Plano de Execução — Spec Driven Development via Claude Code

> [!IMPORTANT]
> Este é o fluxo que você vai seguir no terminal com Claude Code. Cada fase gera specs antes do código.

### Fase 0: Setup (30 min)
```bash
# 1. Criar repo no GitHub
# 2. Inicializar Next.js
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 3. Instalar dependências core
npm install @supabase/supabase-js @supabase/ssr zod

# 4. Instalar shadcn/ui
npx -y shadcn@latest init

# 5. Configurar Supabase (criar projeto no dashboard)
# 6. Criar .env.local com SUPABASE keys
# 7. Estrutura de pastas
```

### Fase 1: PRD & Specs (1h)
**Prompt para Claude Code:**
```
Crie o arquivo docs/PRD.md com um Product Requirements Document enxuto para
uma plataforma de acompanhamento de startups aceleradas pela Bluefields.

O PRD deve conter:
- Problema e contexto
- Personas (time Bluefields)
- User stories priorizadas (MoSCoW)
- Requisitos funcionais e não-funcionais
- Schema de dados
- Critérios de aceite por feature
- Escopo explícito (in/out)
```

### Fase 2: Schema & Auth (1h)
```
# No Claude Code:
1. Gere o schema SQL para Supabase (migrations)
2. Configure auth com Supabase (email/password)
3. Implemente middleware de proteção de rotas
4. Crie o client Supabase (server + client)
5. Implemente RLS policies

# Spec primeiro → depois código → depois review
```

### Fase 3: Backend/API (1.5h)
```
# Ordem de implementação:
1. Types/schemas com Zod (src/lib/schemas.ts)
2. Server actions para startups (CRUD)
3. Server actions para updates (CRUD)
4. Validação + error handling
5. Testes mínimos para server actions
```

### Fase 4: Frontend (2h)
```
# Componentes (usar shadcn):
1. Layout base (sidebar/header + auth state)
2. Dashboard page (cards + summary stats)
3. Startup detail page
4. Forms (create/edit startup, create update)
5. Risk level badge component
6. Filtros e busca no dashboard
```

### Fase 5: Polish & Deploy (1h)
```
1. Seed data (dados de exemplo realistas)
2. Error states e loading states
3. Responsividade mobile
4. Deploy na Vercel
5. Testar fluxo completo no deploy
```

### Fase 6: Documentação & Skill (1h)
```
1. README.md principal
2. docs/AI_USAGE.md (log de como usou IA)
3. docs/EXECUTION_PLAN.md (retrospectiva)
4. skills/code-review-skill.md (framework reutilizável)
5. docs/ARCHITECTURE.md (decisões técnicas)
```

---

## 9. 🤖 Estratégia de Uso de IA — Guardrails

### Princípios
1. **IA gera, humano revisa** — Nunca merge cego
2. **Spec primeiro** — IA recebe spec clara, não pedido vago
3. **Incremental** — Gerar por módulo, não o app inteiro de uma vez
4. **Type-safe** — TypeScript + Zod = guardrail automático contra IA alucinando tipos

### Fluxo Claude Code para cada feature
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. SPEC     │ ──→ │  2. GENERATE │ ──→ │  3. REVIEW   │
│  Definir PRD │     │  Claude gera │     │  Revisar     │
│  + critérios │     │  o código    │     │  criticamente│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐     ┌──────▼──────┐
                    │  5. ITERATE  │ ←── │  4. TEST     │
                    │  Refinar     │     │  Validar     │
                    │  se necessário│     │  + corrigir  │
                    └─────────────┘     └─────────────┘
```

### Template de Prompt para Claude Code
```markdown
## Contexto
[Qual parte do sistema estamos construindo]

## Spec
[Requisitos específicos desta feature]

## Constraints
- Stack: Next.js 14, TypeScript, Supabase, Shadcn/UI
- Patterns: Server Actions para mutations, RSC para data fetching
- Validação: Zod schemas
- Auth: Supabase auth com middleware

## Critérios de aceite
1. [Critério 1]
2. [Critério 2]

## Output esperado
[Quais arquivos gerar, onde colocar]
```

---

## 10. 🛡️ Skill de Code Review & Segurança (entregável 5)

### Conceito
Criar um arquivo `.claude/skills/code-review.md` ou equivalente que funcione como **framework reutilizável** para revisão de código com IA.

### Estrutura da Skill
```markdown
# Code Review & Security Analysis Skill

## Checklist Automático
- [ ] SQL Injection: Verificar uso de prepared statements
- [ ] XSS: Verificar sanitização de inputs renderizados
- [ ] Auth: Verificar que todas as rotas protegidas têm middleware
- [ ] RLS: Verificar que policies estão ativas em todas as tabelas
- [ ] Env vars: Verificar que secrets não estão hardcoded
- [ ] Types: Verificar que não há `any` desnecessário
- [ ] Error handling: Verificar que erros não expõem stack traces
- [ ] Input validation: Verificar Zod schemas em todos os endpoints

## Prompt Template para Review
"Analise o seguinte código considerando:
1. Vulnerabilidades de segurança (OWASP Top 10)
2. Performance (N+1 queries, re-renders)
3. Débito técnico (code smells, violações SOLID)
4. Acessibilidade (ARIA, keyboard nav)
Retorne findings com severidade: CRITICAL / HIGH / MEDIUM / LOW"
```

---

## 11. 📂 Estrutura de Pastas Proposta

```
bluefields-tracker/
├── .claude/
│   └── skills/
│       └── code-review.md          # Skill reutilizável
├── docs/
│   ├── PRD.md                      # Product Requirements Document
│   ├── EXECUTION_PLAN.md           # Plano de execução com IA
│   ├── AI_USAGE.md                 # Log de uso de IA
│   └── ARCHITECTURE.md             # Decisões de arquitetura
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx             # Dashboard principal
│   │   │   └── startups/
│   │   │       ├── [id]/page.tsx    # Detalhe startup
│   │   │       └── new/page.tsx     # Criar startup
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                      # Shadcn components
│   │   ├── dashboard/
│   │   │   ├── startup-card.tsx
│   │   │   ├── risk-badge.tsx
│   │   │   ├── summary-stats.tsx
│   │   │   └── filter-bar.tsx
│   │   ├── startup/
│   │   │   ├── startup-form.tsx
│   │   │   ├── update-form.tsx
│   │   │   └── update-timeline.tsx
│   │   └── layout/
│   │       ├── header.tsx
│   │       └── sidebar.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── schemas.ts               # Zod schemas
│   │   ├── types.ts                 # TypeScript types
│   │   └── utils.ts
│   └── actions/
│       ├── startups.ts              # Server actions startups
│       ├── updates.ts               # Server actions updates
│       └── auth.ts                  # Server actions auth
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local.example
├── README.md
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 12. ⏱️ Cronograma Estimado

| Fase | Tempo | Acumulado | Output |
|---|---|---|---|
| 0. Setup | 30min | 30min | Projeto inicializado, Supabase configurado |
| 1. PRD & Specs | 1h | 1h30 | `docs/PRD.md` completo |
| 2. Schema & Auth | 1h | 2h30 | DB + Auth + RLS funcionando |
| 3. Backend/API | 1h30 | 4h | CRUD completo com validação |
| 4. Frontend | 2h | 6h | Todas as telas funcionais |
| 5. Polish & Deploy | 1h | 7h | App deployed na Vercel |
| 6. Docs & Skill | 1h | 8h | Documentação completa |
| **Total** | **~8h** | | **MVP completo + docs** |

---

## 13. 🎯 Diferenciais para se Destacar

> [!TIP]
> Estes itens **não são obrigatórios** mas podem fazer a diferença na avaliação:

1. **Commit history limpo** — Commits semânticos mostrando evolução (feat:, docs:, fix:)
2. **AI Usage Log detalhado** — Mostrar o que a IA gerou, o que você mudou e **por quê**
3. **Seed data realista** — Não usar "Lorem Ipsum"; criar startups fictícias verossímeis
4. **README com GIF/screenshot** — Primeira impressão conta
5. **Skill de code review funcional** — Que realmente rode e produza output útil
6. **Trade-offs documentados** — "Escolhi X ao invés de Y porque..."
7. **Débito técnico explícito** — Lista de TODOs honestos de coisas que fariam se tivessem mais tempo

---

## 14. 🔑 Primeiros Comandos no Claude Code

Quando estiver pronto para começar, execute no terminal:

```bash
# 1. Navegar para o diretório do projeto
cd projects/case_fullstack_developer

# 2. Iniciar Claude Code
claude

# 3. Primeiro prompt:
# "Inicialize um projeto Next.js 14 com TypeScript, Tailwind CSS,
#  ESLint e App Router neste diretório. Use src/ como diretório source
#  e @/* como import alias."

# 4. Depois:
# "Crie o arquivo docs/PRD.md seguindo a spec que vou te passar..."
```

---

> [!IMPORTANT]
> **Próximo passo:** Revise este brainstorm e me diga:
> 1. A stack proposta (Next.js + Supabase + Vercel) está ok?
> 2. Quer ajustar alguma feature do MVP?
> 3. Quer que eu comece gerando o PRD diretamente?
> 4. Tem preferência por alguma lib de componentes diferente de Shadcn?
