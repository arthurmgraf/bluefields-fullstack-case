# AI-PLAN — Plano de Execução AI-First

> Entregável #2 do case Bluefields. Este documento é um **índice consolidado** de duas peças complementares: o plano de tempo/contingência e o log de uso real de IA.

---

## Estrutura

O conteúdo do AI-PLAN está dividido em dois documentos focados, cada um com responsabilidade única:

| Documento | Cobre | Quando ler |
|---|---|---|
| [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md) | Decomposição do problema, blocos de tempo, checkpoints, contingências de falha, padrões reutilizáveis | Para entender **como o tempo foi alocado** e **o que cortei sob pressão** |
| [`AI_USAGE.md`](AI_USAGE.md) | Toolchain de IA, prompts verbatim, 4 erros específicos da IA com como-detectei-corrigi, trade-offs aceitos | Para entender **como a IA foi usada criticamente**, não como caixa-preta |

---

## Mapeamento aos requisitos do case

O case Bluefields pede que o AI-PLAN cubra:

| Requisito do case | Onde está |
|---|---|
| **Decomposição do problema** | `EXECUTION_PLAN.md` §Plano (tabela de blocos 0:00–6:00) |
| **Ferramentas de IA usadas** | `AI_USAGE.md` §Toolchain (Claude Code Opus 4.7, Cursor, Supabase CLI, gh, TS strict, Zod) |
| **Prompts / abordagem** | `AI_USAGE.md` §Prompts específicos (3 prompts verbatim) e §Meu Fluxo (5 etapas SPEC → RESTRIÇÕES → GEN → LER → RODAR) |
| **Plano de execução** | `EXECUTION_PLAN.md` §Plano + §Contingências |
| **Checkpoints** | `EXECUTION_PLAN.md` §Plano (cortes rígidos por bloco) e §Regras de ouro |
| **Riscos identificados** | `EXECUTION_PLAN.md` §Contingências (4 cenários de falha) e `AI_USAGE.md` §"Onde a IA errou" (4 erros reais detectados) |

---

## Por que dois arquivos em vez de um

O `EXECUTION_PLAN.md` é **prospectivo** — escrito antes do build, define o orçamento e o que cortar. O `AI_USAGE.md` é **retrospectivo e meta-cognitivo** — registra o que a IA fez, errou, como detectei e corrigi.

Misturá-los seria conveniente para o avaliador que faz grep por nome de arquivo, mas penalizaria a leitura: a parte mais importante (os 4 erros da IA) ficaria submersa numa tabela de tempo. Mantive separados e este index serve de ponte.

---

## Leitura recomendada

1. **5 min:** `AI_USAGE.md` §TL;DR + §"Onde a IA errou" — esses são os 5 minutos de maior densidade do projeto inteiro.
2. **3 min:** `EXECUTION_PLAN.md` §Plano + §Contingências — para entender a calibração de orçamento.
3. **2 min:** `AI_USAGE.md` §Trade-offs — para entender o que ficou de fora e por quê.

Total: **10 minutos** para o avaliador absorver o pensamento AI-first deste projeto inteiro.
