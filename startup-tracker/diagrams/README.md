# Diagramas

> **Para a visão didática (Mermaid, render nativo no GitHub):** veja a seção "Diagramas" no [README raiz](../../README.md#diagramas) ou no [README do startup-tracker](../README.md#diagramas).
>
> Esta pasta guarda a **versão técnica detalhada em Excalidraw** — útil para quem vai mexer no código ou auditar o modelo de segurança a fundo.

---

## Arquivos

| Arquivo | O que mostra | Quando abrir |
|---------|---|---|
| [`architecture.excalidraw`](architecture.excalidraw) | Visão macro: Navegador → Vercel Edge (Next.js + middleware + RSC + Server Actions + Zod) → Supabase (Auth + Postgres com RLS) | Primeira orientação técnica |
| [`data-flow.excalidraw`](data-flow.excalidraw) | Três fluxos lado a lado: Leitura (RSC), Escrita (Server Action com Zod), Auth (magic-link OTP) | Para entender a mecânica de runtime |
| [`data-model.excalidraw`](data-model.excalidraw) | Esquema ER de `profiles · startups · startup_updates` com FKs e resumo de políticas RLS | Antes de tocar na migration ou escrever query nova |

PNGs antigos (`*.png`) acompanham os arquivos para preview rápido em editores que não renderizam Excalidraw — eles são gerados a partir dos `.excalidraw` e podem ficar atrás de uma versão.

---

## Como abrir

- **Online (sem instalar nada):** [excalidraw.com](https://excalidraw.com) → menu → Open → selecionar o `.excalidraw`
- **VS Code:** instalar a extensão *Excalidraw* (`pomdtr.excalidraw-editor`) — abre `.excalidraw` inline
- **Exportar como PNG:** dentro do excalidraw.com → menu → Save as image → PNG

---

## Semântica de cores (consistente nos três)

| Cor | Significado |
|-----|---|
| 🟦 Azul | Navegador / superfície voltada ao usuário |
| 🟨 Amarelo | Vercel / Next.js (middleware, route handlers, RSC) |
| 🟩 Verde | Supabase (Auth, Postgres, fronteira protegida por RLS) |
| 🩷 Rosa | Server Actions (mutações) |
| 🟪 Roxo | Schemas Zod (validação em runtime) |
| 🟥 Vermelho tracejado | Fronteira de RLS / segurança |

---

## Por que duas representações (Mermaid + Excalidraw)?

| Mermaid (no README) | Excalidraw (esta pasta) |
|---|---|
| Renderiza nativo no GitHub | Precisa abrir em editor próprio |
| Em PT-BR, com emojis e cores didáticas | Em inglês técnico, com bindings e cores semânticas |
| Para avaliador / pessoa não técnica | Para quem vai modificar o sistema |
| Atualização rápida via texto | Edição visual com drag-and-drop |

Os dois mostram a mesma arquitetura — escolha conforme a audiência.
