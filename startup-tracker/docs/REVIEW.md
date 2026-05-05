# REVIEW — Auto-avaliação

> Entregável #7 do case Bluefields. O documento que o avaliador lê para entender se o desenvolvedor sabe **o que entregou bem, o que entregou mal e o que adiou de propósito**. Sem volta da vitória.

---

## TL;DR

| Eixo | Auto-nota | Por quê |
|---|---|---|
| **Entendimento do problema** | Forte | PRD §1 traduz a dor real ("mando msg pra 5 pessoas") em escopo executável |
| **Qualidade do PRD** | Forte | MoSCoW + critérios de aceitação testáveis + escopo recortado com 10 itens explicitamente fora |
| **Plano AI-First** | Forte | `AI_USAGE.md` documenta 4 erros específicos da IA com **como detectei + correção** |
| **Execução fullstack** | Sólido | Login + CRUD + dashboard + RLS + deploy. Tudo que o brief pediu, nada além. |
| **Qualidade técnica** | Boa, com lacuna consciente | TS strict + Zod + RLS. **Sem suite de testes** — dívida assumida e justificada (§Dívida). |
| **Segurança** | Forte | Defesa em profundidade (middleware → layout → action → RLS); 4 camadas. |
| **Documentação** | Forte | 5 documentos focados, cada um < 5 min de leitura. Sem prosa decorativa. |

---

## Forças (o que eu defendo numa entrevista)

### 1. Disciplina de revisão linha-por-linha sobre código de IA

A meta-decisão mais cara deste projeto é **assumir que ~85% do código vem da IA e ainda assim ser pessoalmente responsável por cada linha**. Os 4 erros documentados em `AI_USAGE.md` §"Onde a IA errou" são todos casos onde o código *parecia certo* à primeira vista — incluindo um `using (true)` em RLS que teria liberado leitura anônima de todas as startups em produção. A revisão não é uma "etapa" depois do prompt; é parte do prompt-loop.

### 2. Defesa em profundidade real, não teatral

Quatro camadas independentes precisam falhar para um anônimo ler dados:
1. Middleware redireciona não-autenticados
2. Layout `(authed)` re-checa `getUser()` no server
3. Server Action re-checa `getUser()` antes de qualquer DB call
4. Política RLS no Postgres recusa qualquer query sem `auth.role() = 'authenticated'`

Se eu cair na camada 1 por bug, ainda estou seguro. A `NEXT_PUBLIC_SUPABASE_ANON_KEY` ser pública é por design — a chave não é o segredo, RLS é.

### 3. Ordem schema → types → actions → UI

Documentado em `EXECUTION_PLAN.md` §Padrões. Quando inverti essa ordem em uma tentativa anterior, a IA alucinou nomes de coluna que tive que ajustar manualmente depois. **Schema-first elimina retrabalho de IA.**

### 4. Zod como contrato runtime, não como decoração

`src/lib/schemas.ts` é a fonte única de verdade. Tipos da action são derivados via `z.infer<>` — não há schema "para o tipo" e schema "para validar" separados. Cada Server Action chama `safeParse` na primeira linha. Sem isso, qualquer FormData forjado bypassaria o TS.

### 5. Skill reutilizável genuína

`.claude/skills/code-review/SKILL.md` foi escrita para **qualquer projeto Next.js + Supabase**, não para este. A seção "Customizing for your stack" mostra como portar para outro framework. Não é o "deliverable obrigatório que vou jogar fora amanhã" — é um arquivo que vai pra todos os meus repos seguintes.

---

## Melhorias futuras (próximos 1–2 sprints)

> Lista priorizada, não dump. Cada item tem ETA realista e gatilho.

### Sprint 1 — Fundação de testes (~3h)

1. **Vitest + Testing Library + ~80% cobertura.** Smoke manual não escala além do MVP. ETA: 2h.
2. **Playwright E2E para o fluxo magic-link.** O caminho mais frágil (e-mail externo, callback, troca de cookie) não tem teste automatizado hoje. ETA: 1h.
3. **Pre-commit hook com `tsc --noEmit` + `eslint`.** Pegaria o `any` que vazei em `startups.ts` antes do commit. ETA: 15min.

### Sprint 2 — Operação real (~4h)

4. **Edição/exclusão de atualizações.** Append-only é defensável no MVP, mas erro de digitação humana é frequente. UI de edit + audit trail. ETA: 2h.
5. **Filtros + busca no dashboard.** Cresce em valor à medida que o portfolio passa de 20 startups. ETA: 1h.
6. **Sparkline de risco na página de detalhes.** Mostrar trajetória, não só último valor. ETA: 1h.

### Sprint 3 — Produção séria

7. **Sentry + structured logging.** `console.error` no Vercel logs cobre o MVP, não cobre paging.
8. **Rate limit nas Server Actions.** Magic-link é unauth → alvo de spam. `@upstash/ratelimit`.
9. **Separação admin/viewer.** Adicionar coluna `role` em `profiles` + apertar políticas RLS. ~1h.

---

## Dívida técnica conscientemente aceita

> Cada item aqui foi uma escolha — não um descuido. A diferença entre "dívida" e "bug" é a justificativa documentada.

| Dívida | Razão da escolha | Risco assumido | Caminho de saída |
|---|---|---|---|
| **Sem suite de testes formal** | Orçamento de 6h. Escolhi entregar deploy + docs sobre testes. | Regressão silenciosa em refator. | TS strict + Zod + smoke manual ancorado nos critérios do PRD §7. ETA pra remover: 3h. |
| **Atualizações append-only** | UX intuitiva (histórico imutável) + economiza UI de edit. | Erro de digitação fica registrado. | Próximo sprint, com audit trail. |
| **Papel único (sem admin/viewer)** | Economiza ~30 min de RLS + UI. | Todos podem tudo. | Coluna `role` + RLS apertado. ~1h. |
| **Sem real-time (websocket)** | RSC + `revalidatePath` cobre o MVP; WebSocket exigiria servidor stateful. | Edição concorrente sem feedback. | Supabase Realtime quando 2+ usuários simultâneos virar regra. |
| **Sem CI no GitHub Actions** | Pré-commit hooks não foram instalados; CI exigiria configurar workflow. | Quebras só descobertas em produção. | Pipeline `install → typecheck → lint → preview deploy`. ~30min. |
| **`useTransition` em vez de react-hook-form** | Zero deps; funciona sem JS via form action. | Menos flexível para forms complexos. | Aceitável até passar de 5 forms; trocar quando crescer. |
| **`NEXT_PUBLIC_SUPABASE_ANON_KEY` no cliente** | Por design do Supabase; segurança é RLS, não a chave. | Auditoria que não entende RLS pode marcar como falha. | Não há — é o modelo correto. Documentado em `ARCHITECTURE.md` §Segurança. |

---

## Fraquezas honestas (o que eu não defendo)

- **A retrospectiva em `EXECUTION_PLAN.md` não tem números reais de tempo gasto por bloco.** Eu não cronometrei rigorosamente — estimei depois. Numa próxima build com mesmo orçamento eu rodaria um timer.
- **Não escrevi sequer um teste**, nem mesmo um teste smoke automatizado. A defesa por "smoke manual" é honesta mas frágil; um único `pytest` ou `vitest` rodando no CI elevaria a barra com pouco custo.
- **Sem Loom video (entregável bônus #8).** O brief sinaliza isso como diferencial; não entreguei.
- **Idioma das docs internas é misto** — algumas em PT-BR (READMEs, PRD), outras em EN (TODO, SKILL). Coerência total seria melhor.

---

## O que esta auto-avaliação não é

Não é uma lista de TODOs disfarçada — para isso existe `TODO.md`. Não é a retrospectiva do build — para isso existe `EXECUTION_PLAN.md` §Retrospectiva. Este documento responde a uma pergunta única: **se eu fosse contratado e entrasse no time amanhã, o que eu mesmo apontaria primeiro?**

Resposta: instalar Vitest, fechar a CI, escrever o primeiro teste de auth. Nessa ordem. Antes de qualquer feature nova.
