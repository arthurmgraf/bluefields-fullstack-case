# PRD — Startup Tracker

> Documento de Requisitos do Produto para o MVP. Conciso por design: cada seção é uma tela de leitura.

| Campo | Valor |
|---|---|
| **Produto** | Startup Tracker |
| **Versão** | 0.1 (MVP) |
| **Data** | 04/05/2026 |
| **Responsável** | Solo build |

---

## 1. Problema

Aceleradoras e venture studios acompanham dezenas ou centenas de startups em seu portfólio. O status de cada uma vive espalhado em WhatsApp, e-mail, Notion, Google Drive e conhecimento tácito. O custo: 4 a 6 horas por dia perdidas na busca por informações, detecção tardia de startups em dificuldade e tomada de decisão sem uma fonte única de verdade compartilhada.

**Frase de dor:** *"Tenho que mandar mensagem para 5 pessoas para saber se a Startup X está no caminho certo esta semana."*

---

## 2. Objetivo

Um aplicativo web autenticado único onde qualquer membro da equipe possa:

- Ver **todas as startups** do portfólio em uma única visualização, com o nível de risco atual
- Abrir qualquer startup e ver seu **histórico completo de atualizações** cronologicamente
- **Adicionar uma atualização** em menos de 30 segundos: progresso, impedimentos, próximos passos e nível de risco

---

## 3. Personas

| Persona | Papel | O que faz aqui |
|---------|------|---|
| **Líder de Portfólio** | Gerencia a coorte de investimentos da aceleradora | Revisa o dashboard diariamente, foca nas startups com risco médio/alto (amarelo/vermelho) |
| **Analista de Aceleração** | Contato direto com os fundadores | Adiciona atualizações semanais após cada reunião ou call |

> O MVP colapsa ambas as personas em um único papel de "usuário autenticado". A separação entre administrador/visualizador foi adiada (ver §8).

---

## 4. Histórias de Usuário (MoSCoW)

### Must Have (Obrigatório)

- **US-1** Como membro da equipe, eu faço login com meu e-mail de trabalho para não precisar lembrar de outra senha
- **US-2** Como membro da equipe, eu vejo todas as startups em uma grade única com seus riscos atuais para identificar problemas imediatamente
- **US-3** Como membro da equipe, eu clico em uma startup e vejo todo o seu histórico de atualizações cronologicamente
- **US-4** Como membro da equipe, eu adiciono uma nova atualização com progresso / impedimentos / próximos passos / risco em um único formulário
- **US-5** Como membro da equipe, eu posso cadastrar uma nova startup que a equipe começou a acompanhar
- **US-6** Como administrador, garanto que o tráfego anônimo não possa ler ou gravar nenhum dado

### Should Have (Importante)

- **US-7** Como membro da equipe, eu vejo quantas startups estão em 🟢 / 🟡 / 🔴 no topo do dashboard
- **US-8** Como membro da equipe, as startups atualizadas mais recentemente aparecem primeiro

### Could Have (Desejável - Adiado)

- Filtros e busca no dashboard
- Edição rápida do nível de risco nos cards
- Visualização do histórico de risco (gráfico de linha do risco ao longo do tempo)
- Renderização de Markdown nas atualizações
- Edição/exclusão de atualizações (atualmente apenas inserção)
- Separação de papéis Admin/Visualizador

---

## 5. Requisitos Funcionais

| ID | Requisito |
|----|---|
| FR-1 | Login via Magic-link usando Supabase Auth |
| FR-2 | Dashboard lista todas as startups, ordenadas por `updated_at DESC` |
| FR-3 | Dashboard mostra contadores de resumo agrupados por `risk_level` |
| FR-4 | Página de detalhes mostra metadados da startup + lista cronológica de atualizações (mais recentes primeiro) |
| FR-5 | Formulário na página de detalhes cria uma nova atualização |
| FR-6 | A criação de uma atualização reflete o `risk_level` na startup pai |
| FR-7 | Formulário no dashboard cria uma nova startup |
| FR-8 | Logout limpa a sessão e redireciona para `/login` |

## 6. Requisitos Não Funcionais

| ID | Requisito |
|----|---|
| NFR-1 | Todo acesso a dados é forçado na camada do BD via Row Level Security (RLS) |
| NFR-2 | Zero tipos `any` no código de produção |
| NFR-3 | Toda Server Action valida a entrada com Zod antes de qualquer chamada ao banco |
| NFR-4 | p95 de carregamento de página < 2s no tier free da Vercel (cold start) |
| NFR-5 | Entrega do Magic-link concluída em < 30s |
| NFR-6 | A UI funciona sem JavaScript para o fluxo de autenticação (form actions) |

---

## 7. Critérios de Aceitação (Checklist de Teste)

- [ ] Enviar e-mail válido em `/login` → magic-link chega → clicar → pousar em `/`
- [ ] Dashboard mostra startups iniciais com os selos de risco corretos
- [ ] Clicar em qualquer card → página de detalhes carrega com metadados + linha do tempo de atualizações
- [ ] Enviar uma nova atualização → ela aparece no topo da linha do tempo; o risco do pai reflete o novo nível
- [ ] Abrir `/startups/{qualquer-uuid}` em guia anônima → redirecionado para `/login`
- [ ] Enviar formulário com `content` vazio → erro de validação exibido; sem gravação no BD
- [ ] Enviar formulário com `risk_level` inválido → rejeitado pelo Zod; sem gravação no BD
- [ ] Fazer logout → cookie limpo → acesso negado a `/`

---

## 8. Fora do Escopo (MVP)

- Filtros / Busca avançada
- Visualização de histórico de risco (gráficos)
- Controle de acesso baseado em papéis (admin/visualizador)
- Editor Markdown para atualizações
- Edição / Exclusão de atualizações
- Notificações / Resumos por e-mail
- Integrações com WhatsApp / Slack
- Upload de arquivos (pitch decks)
- Multi-tenancy (múltiplas organizações)
- Funcionalidades de IA dentro do produto

---

## 9. Restrições Técnicas

- **Stack** definida: Next.js 14 (App Router) + Supabase + Vercel + TypeScript + Tailwind + Shadcn + Zod
- **Apenas camadas gratuitas**: Vercel Hobby + Supabase Free
- **Orçamento de tempo**: 6h de tempo real para o desenvolvimento original
- **Sem chave service-role** no app — apenas anon key + RLS

---

## 10. Diagramas

Veja [`../diagrams/`](../diagrams/) para três diagramas Excalidraw (atualizados com a paleta Bluefields):
- `architecture.excalidraw` — Visão geral do sistema (Browser → Vercel/Next.js → Supabase)
- `data-flow.excalidraw` — Fluxos de Leitura, Escrita e Autenticação
- `data-model.excalidraw` — Esquema ER com chaves estrangeiras e resumo de RLS
