# Diagramas

Três diagramas Excalidraw que explicam a aplicação ponta a ponta. Abra em [excalidraw.com](https://excalidraw.com) → File → Open, ou em qualquer editor compatível com Excalidraw (a extensão Excalidraw do VS Code renderiza inline).

| Diagrama | O que mostra | Quando ler |
|---------|---|---|
| [`architecture.excalidraw`](architecture.excalidraw) | Visão macro: Browser → Vercel Edge (Next.js + middleware + RSC + Server Actions + Zod) → Supabase (Auth + Postgres com RLS) | Primeira orientação |
| [`data-flow.excalidraw`](data-flow.excalidraw) | Três fluxos no mesmo canvas: Leitura (RSC dashboard), Escrita (Server Action com fronteira Zod), Auth (magic-link OTP) | Para entender a mecânica de runtime |
| [`data-model.excalidraw`](data-model.excalidraw) | Esquema ER de `profiles · startups · startup_updates` com FKs e resumo anotado das políticas RLS | Antes de tocar na migration ou escrever uma query |

PNGs (`*.png`) ficam ao lado dos arquivos para preview rápido em editores que não renderizam Excalidraw.

## Semântica de cores (consistente nos três)

| Cor | Significado |
|-----|---------|
| 🟦 Azul | Browser / HTML / superfície voltada ao usuário |
| 🟨 Amarelo | Vercel / Next.js (middleware, route handlers, RSC) |
| 🟩 Verde | Supabase (Auth, Postgres, fronteira protegida por RLS) |
| 🩷 Rosa | Server Actions (mutações) |
| 🟪 Roxo | Schemas Zod (validação em runtime) |
| 🟥 Vermelho tracejado | Fronteira de RLS / segurança |

## Regenerando

Os arquivos foram desenhados à mão a partir do `DESIGN_BLUEFIELDS_TRACKER.md`. Para regenerar a partir do código, invoque a skill do Claude Code `/generate-diagrams` (o `diagram-generator-agent` está configurado em `.claude/agents/`).
