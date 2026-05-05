# Como Usei IA para Construir Este Projeto

> O log honesto de onde a IA ajudou, onde ela falhou e como eu identifiquei as falhas. Este documento é o artefato de maior sinal no repositório.

---

## TL;DR (Resumo)

Construído de ponta a ponta com o **Claude Code (Opus 4.7)** como par primário, com uma disciplina rigorosa de revisão:

- **~85%** do código é gerado por IA
- **100%** do código foi revisado linha por linha antes de ser commitado
- **4 erros substanciais da IA** identificados na revisão (tabela abaixo)

O trade-off que aceitei: **sem suite de testes formal no MVP.** Substituído por três proteções (guardrails) — TypeScript strict, Zod em todas as fronteiras de Server Action e um checklist de smoke test manual ancorado nos critérios de aceitação do PRD.

---

## Minha Toolchain (Ferramentas)

| Ferramenta | Papel |
|------|------|
| **Claude Code (Opus 4.7)** | Gerador de código primário; executou o fluxo completo de SDD (BRAINSTORM → DEFINE → DESIGN → BUILD) |
| **Cursor** | Refatorações locais rápidas e edições de nível "tab-completion" |
| **Supabase CLI** | Geração de tipos do BD: `supabase gen types typescript` |
| **gh CLI** | Criação do repositório no GitHub, revisão de PRs |
| **TypeScript strict mode** | Compilador como linter — captura tipos alucinados pela IA antes de entrarem em produção |
| **Zod** | Barreira de segurança em tempo de execução em todas as fronteiras de Server Action |

---

## Meu Fluxo (por funcionalidade)

```
   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ 1. SPEC │ ─→ │ 2. RESTRI│ ─→ │ 3. GEN  │ ─→ │ 4. LER  │ ─→ │ 5. RODAR│
   │ em ling.│    │ -ÇÕES   │    │ Claude  │    │ CADA    │    │ + iterar│
   │ simples │    │ como ctx│    │ escreve │    │ LINHA   │    │ se ruim │
   └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

O passo 4 é a parte que a maioria das pessoas ignora. É a parte que realmente importa.

---

## Prompts específicos que usei (verbatim)

### Prompt 1 — Server Actions

> "Crie três Server Actions em `src/actions/`: `auth.ts` (signIn com Supabase magic link OTP, signOut), `startups.ts` (listStartups, getStartup, createStartup) e `updates.ts` (createUpdate que também espelha o risk_level na linha da startup pai). Restrições: Next.js 14 App Router, `@supabase/ssr`, Zod de `@/lib/schemas` na fronteira, nunca use `any`, logue falhas com `console.error('<name> failed:', err.message, { context })`, retorne uma discriminated union `{ ok: true } | { ok: false, error, fieldErrors? }`. Após cada mutação, chame `revalidatePath`."

### Prompt 2 — Migração RLS

> "Escreva uma migração SQL do Supabase para três tabelas: `profiles`, `startups`, `startup_updates`. Restrições: `enable row level security` em cada uma, use políticas de 'drop-and-recreate' para que a migração seja idempotente, trigger de auto-criação de perfil via `handle_new_user()`, índices para a query de linha do tempo e ORDER BY do dashboard. Enum de Phase restrito ao nível da tabela."

### Prompt 3 — Formulário de atualização

> "Crie um componente cliente `update-form.tsx` usando `useTransition` para enviar para a Server Action `createUpdate`. Renderize os `fieldErrors` do Zod ao lado de cada entrada. Limpe o formulário em caso de sucesso. Sem biblioteca de formulários externa — apenas `<form action={...}>` puro com FormData."

---

## Onde a IA errou (e como identifiquei)

| # | O que ela fez | Por que estava errado | Como identifiquei | Correção |
|---|-------------|------------------|-----------------|-----|
| 1 | O primeiro rascunho de `lib/supabase/server.ts` não envolvia o `cookieStore.set` em um try/catch | No contexto de RSC, o `setAll` lança erro — teria produzido erros em tempo de execução em cada carregamento de página | Revisão linha por linha comparando com a documentação oficial do `@supabase/ssr` para Next.js 14 | Envolvi em try/catch com um comentário explicando a separação entre RSC e middleware |
| 2 | O primeiro rascunho de `createUpdate` apenas inseria em `startup_updates` e esquecia de espelhar o `risk_level` na linha pai em `startups` | O `updated_at` nunca seria atualizado → ordenação do dashboard errada; o `risk_level` nos cards divergiria da última atualização | Smoke test de ordenação no dashboard — cliquei em uma startup, adicionei uma atualização "vermelha", voltei ao dashboard e o card ainda estava verde | Adicionei o `UPDATE startups SET risk_level, updated_at WHERE id = ...` secundário após o insert |
| 3 | Política RLS gerada: `create policy "anon_read" ... using (true)` para a tabela `startups` | Teria permitido tráfego anônimo fazer SELECT em todas as startups — falha de segurança. A chave anon é `NEXT_PUBLIC_*` e enviada ao navegador | Li cada linha do arquivo de migração; sinalizei o `using (true)` imediatamente | Restringi para `auth.role() = 'authenticated'` |
| 4 | Usou `any` para o formato da resposta do Supabase com join (`profiles:responsible_id(...)` retorna um objeto relacional) | Perda de segurança de tipo no formato anulável do join; aceitaria silenciosamente campos ausentes | O modo strict do TypeScript sinalizou ao salvar (`noUncheckedIndexedAccess`) | Fiz um cast através de uma interface estreita `{ full_name: string \| null } \| null` e usei type narrowing |

> **Padrão nos quatro erros:** Os padrões da IA são *corretos o suficiente para parecerem certos à primeira vista*. O custo de pular a revisão linha por linha é pagar por esses erros em produção. O custo de fazê-la é de ~30 segundos por arquivo. Não há versão da matemática onde pular a revisão saia ganhando.

---

## O que eu faria diferente na próxima vez

- **Gerar a migração ANTES de gerar as Server Actions.** Quando gerei as actions primeiro, a IA alucinou nomes de colunas que tive que ajustar manualmente na migração depois. Schema → types → actions → UI é a ordem correta.
- **Fixar a versão do cliente JS do Supabase no primeiro dia.** O `@supabase/ssr` teve uma pequena mudança que quebra a compatibilidade (breaking change) entre versões recentes; não fixar a versão custa ~10 minutos na primeira vez que você encontra o problema.
- **Escrever o 'hero' do README por último, mas seu esqueleto primeiro.** Saber o que a URL pública precisa mostrar na primeira tela ajuda a definir um PRD mais afiado.

---

## Trade-offs que aceitei (com motivos)

| Trade-off | Por que aceitei | Qual o risco |
|---|---|---|
| **Sem suite de testes formal** | Orçamento de 6h; testes teriam consumido o tempo de documentação e deploy | Risco de regressão em mudanças futuras. Mitigado por TS strict + Zod + smoke manual. Documentado em `TODO.md`. |
| **Papel único (sem admin/viewer)** | Economiza 30 min de trabalho em políticas e uma camada de permissão na UI | Ambientes reais precisam disso. Caminho de migração: adicionar coluna `role` em `profiles` + restringir políticas. ~1h de trabalho. |
| **Atualizações append-only** | Elimina a UI de CRUD de edição/exclusão; combina com a intuição de "histórico imutável" | Erros de digitação nas atualizações permanecem. Aceitável para MVP; edição com histórico fica para a v0.2. |
| **`useTransition` em vez de lib de formulário** | Zero dependências; funciona sem JS via form action; superfície de código mínima no cliente | Menos flexível que `react-hook-form`; suficiente para apenas dois formulários. |
| **Sem tempo real (Real-time)** | RSC + `revalidatePath` é suficiente; WebSocket teria adicionado a necessidade de um servidor estilo Express | Edição concorrente por múltiplos usuários é um problema para a v0.2. |

---

## Artefatos reutilizáveis desta build

- **Skill de code-review** em [`.claude/skills/code-review/SKILL.md`](../.claude/skills/code-review/SKILL.md) — skill para o Claude Code para revisão assistida por IA com classificações de gravidade + mapeamento OWASP. Genérica e agnóstica ao projeto.
- **A cadeia SDD** (BRAINSTORM → DEFINE → DESIGN) vive em `.claude/sdd/features/` da submissão pai. Reutilizável como template para qualquer build de MVP assistida por IA.

---

## O que este documento não é

Não é um "victory lap" (volta da vitória). A IA fez um trabalho real aqui, *e* a IA cometeu erros reais aqui. A disciplina está em capturá-los. Esse é o trabalho inteiro, e é a razão total pela qual este documento existe.
