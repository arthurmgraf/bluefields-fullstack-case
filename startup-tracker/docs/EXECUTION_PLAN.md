# Plano de Execução e Retrospectiva

> O plano de desenvolvimento e o "post-mortem" em um só lugar.

---

## Plano (definido na hora 0)

| Hora | Bloco | Entrega | Corte Rígido |
|------|-------|--------|-------------|
| 0:00 – 0:45 | Setup + PRD + Schema | Iniciação do projeto, Supabase configurado, migração do schema, PRD v1 | 0:45 |
| 0:45 – 1:45 | Auth + Server Actions | Login via Magic-link, barreira de middleware, todas as 3 actions com Zod | 1:45 |
| 1:45 – 3:30 | UI — 3 páginas | `/login`, dashboard `/`, detalhes `/startups/[id]` com formulário inline | 3:30 |
| 3:30 – 4:15 | Polish + Seed + Deploy | 8 startups iniciais (seed), deploy na Vercel, smoke tests aprovados em prod | 4:15 |
| 4:15 – 5:30 | Docs + Skill | README, AI_USAGE, ARCHITECTURE, TODO, skill de code-review | 5:30 |
| 5:30 – 6:00 | Buffer | Revisão final, capturas de tela para o README, e-mail de submissão | 6:00 |

**Regra:** se um bloco ultrapassar o tempo em >15min, entregue o que funciona e pule para o próximo. Sem "buracos de coelho" (rabbit holes).

---

## Contingências para falhas (definidas com antecedência)

| Na hora | Se incompleto, descarte... | Não descarte... |
|---------|------------------------|----------------|
| 1:45 (auth não ok) | Magic link → use senha demo fixa no seed | Schema do BD, etapa de deploy |
| 3:30 (UI atrasada) | Página de detalhes → coloque as atualizações em um modal no dashboard | A página do dashboard em si |
| 4:15 (problemas no deploy) | Push direto via Vercel CLI, pule a conexão Git da Vercel | Uma URL funcional de qualquer tipo |
| 5:30 (docs atrasados) | Reduza o AI_USAGE para 80 linhas, pule ARCHITECTURE | README, skill, AI_USAGE |

### Regras de ouro
- **Nunca pule a etapa de deploy.** Uma URL da Vercel funcionando vence um localhost perfeito.
- **Nunca pule o AI_USAGE.md.** É o documento de maior valor para o avaliador.
- **Nunca pule a revisão linha por linha.** Essa é a premissa fundamental deste fluxo.

---

## Realizado (preenchido ao final do build)

| Bloco | Estimado | Real | Variação | Notas |
|-------|-----------|--------|----------|-------|
| 0:00–0:45 Setup + PRD + Schema | 45min | ~50min | +5min | RLS com `using (true)` da IA exigiu reescrita imediata da política |
| 0:45–1:45 Auth + Actions | 60min | ~70min | +10min | `cookies.set` no contexto RSC sem try/catch (erro #1 de IA); custou ~10min de debug |
| 1:45–3:30 UI | 105min | ~95min | -10min | Shadcn acelerou; ganho de tempo aqui compensou as derrapagens anteriores |
| 3:30–4:15 Polish + Deploy | 45min | ~45min | 0 | Vercel deploy primeira tentativa funcionou; smoke test em prod aprovado |
| 4:15–5:30 Docs + Skill | 75min | ~90min | +15min | `AI_USAGE.md` cresceu além do estimado — 4 erros para documentar com fix concreto |
| 5:30–6:00 Buffer | 30min | ~10min | -20min | Buffer consumido pelas variações acima; restou só para captura de prints |

**Total real: ~6h05** — dentro do orçamento. Variação principal: documentação consumiu mais tempo que o estimado, compensada por UI mais rápida via Shadcn.

---

## Retrospectiva

### O que deu certo

- **Schema → types → actions → UI nessa ordem.** A primeira tentativa (em outro projeto) inverteu a ordem; a IA alucinou nomes de coluna. Aqui a IA gerou tudo coerente porque o schema já existia como ground truth.
- **TS strict + Zod pegaram 2 dos 4 erros da IA na hora de salvar o arquivo**, antes mesmo de eu rodar o código. O `noUncheckedIndexedAccess` flagou o `any` em joins do Supabase imediatamente.
- **Defesa em profundidade (4 camadas de auth) caiu naturalmente** porque cada camada foi adicionada num bloco diferente: middleware no setup, layout check com a UI, action check com Server Actions, RLS no schema. Ninguém precisou "lembrar de adicionar segurança no fim".
- **Revisão linha-por-linha fez parte do prompt-loop, não foi etapa separada.** O erro RLS `using (true)` era CRÍTICO e teria escapado se eu tratasse review como "passo final antes do commit".

### O que eu mudaria

- **Fixar versão exata do `@supabase/ssr` no primeiro `npm install`.** A breaking change recente do pacote me custou ~10min na primeira vez que o middleware quebrou.
- **Escrever o esqueleto do README primeiro, hero por último.** Saber o que a URL pública precisa mostrar focaria o PRD mais cedo.
- **Cronometrar com timer dedicado.** Estimei a tabela "Realizado" depois — mais honesto seria um Toggl rodando em background.
- **Instalar pre-commit hook com `tsc --noEmit` no minuto 1**, não deixar para depois. Pegaria o `any` em `startups.ts` antes do commit e me pouparia uma descoberta tardia.

### O que eu aprendi

- **"AI generated code looks right at a glance" é literal.** Os 4 erros documentados em `AI_USAGE.md` parecem todos código razoável. O sinal está em ler em voz baixa cada linha contra a documentação oficial — não em rodar o código e ver se passa.
- **Server Actions + RSC é mais rápido que API routes para CRUD simples.** Eliminei ~60% do boilerplate que um SPA equivalente teria. Vou usar esse padrão como default para qualquer MVP futuro de pequeno-médio porte.
- **A "skill" reutilizável é destilação de incidentes reais, não framework abstrato.** Se eu tivesse escrito o `SKILL.md` antes do build, ele seria genérico e útil para ninguém. Cada item do checklist atual veio de um erro específico que aconteceu.

---

## Padrões reutilizáveis extraídos desta build

Os padrões abaixo não são específicos deste produto — são a forma como eu construiria *qualquer* MVP auxiliado por IA da próxima vez.

1. **Schema → types → actions → UI.** Sempre nessa ordem. Gerar a UI antes que o schema esteja fixo produz refatorações por incompatibilidade de formato.
2. **Schemas Zod vivem em um único arquivo.** Importáveis de qualquer Server Action; tipo inferido via `z.infer<>`. Fonte única de verdade.
3. **`@supabase/ssr` possui três contextos.** Servidor (RSC + actions), browser, middleware. Não os misture. A variante do middleware existe especificamente porque os cookies se comportam de forma diferente no middleware vs RSC.
4. **Tipos de retorno em Discriminated-union para Server Actions.** `{ ok: true, data? } | { ok: false, error, fieldErrors? }`. Mais fácil para a UI do que try/catch em volta de `await action(...)`.
5. **`'use client'` é um custo.** Use RSC por padrão; mude para cliente apenas quando precisar de um event handler ou estado exclusivo do navegador.
6. **`revalidatePath` após cada mutação.** Esta é a disciplina de invalidação de cache. Esquecer uma vez e o bug consumirá uma hora de depuração.
7. **Os padrões da IA são *quase* corretos.** Incorpore a leitura linha por linha no fluxo de trabalho, não como uma "etapa de revisão" separada. Caso contrário, ela será descartada sob pressão.
