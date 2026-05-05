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

## Realizado (preenchido durante a build)

| Bloco | Estimado | Real | Variação | Notas |
|-------|-----------|--------|----------|-------|
| 0:00–0:45 Setup + PRD + Schema | 45min | _A preencher_ | | |
| 0:45–1:45 Auth + Actions | 60min | _A preencher_ | | |
| 1:45–3:30 UI | 105min | _A preencher_ | | |
| 3:30–4:15 Polish + Deploy | 45min | _A preencher_ | | |
| 4:15–5:30 Docs + Skill | 75min | _A preencher_ | | |
| 5:30–6:00 Buffer | 30min | _A preencher_ | | |

> Atualize esta tabela ao final da build com os números reais. A honestidade aqui é mais valiosa do que acertar as estimativas.

---

## Retrospectiva (preenchida ao final)

### O que deu certo
- _a preencher_

### O que eu mudaria
- _a preencher_

### O que eu aprendi
- _a preencher_

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
