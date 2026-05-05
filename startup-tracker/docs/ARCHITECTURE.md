# Arquitetura

> Design do sistema, decisões-chave e modelo de segurança em 5 minutos de leitura.

---

## Diagrama do sistema

```text
┌──────────────────────────────────────────────────────────────────────┐
│                          USUÁRIO (browser)                            │
│                              │                                        │
│                          HTTPS / cookies                              │
│                              ▼                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                     VERCEL EDGE (Next.js 14)                   │  │
│  │  ┌─────────────────┐  ┌────────────────────────────────────┐  │  │
│  │  │  middleware.ts  │  │           App Router               │  │  │
│  │  │  refreshSession │→ │  /login        → page.tsx (RSC)    │  │  │
│  │  │  + route gate   │  │  /auth/callback → route.ts         │  │  │
│  │  └─────────────────┘  │  /              → page.tsx (RSC)   │  │  │
│  │                       │  /startups/[id]→ page.tsx (RSC)    │  │  │
│  │                       └────────┬───────────────────────────┘  │  │
│  │                                │ Server Actions                │  │
│  │                                │ (Validação Zod)               │  │
│  │                                ▼                                │  │
│  │                       ┌────────────────────┐                    │  │
│  │                       │  src/actions/*.ts  │                    │  │
│  │                       └────────┬───────────┘                    │  │
│  └────────────────────────────────┼────────────────────────────────┘  │
│                                   │ @supabase/ssr (JWT cookie)        │
│                                   ▼                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                          SUPABASE                              │  │
│  │  ┌──────────────────┐    ┌─────────────────────────────────┐ │  │
│  │  │  Auth (GoTrue)   │    │   Postgres + RLS                │ │  │
│  │  │  - Magic link    │    │   ┌──────────────────────┐      │ │  │
│  │  │  - Emissão JWT   │    │   │ profiles · startups  │      │ │  │
│  │  │                  │    │   │ startup_updates      │      │ │  │
│  │  └──────────────────┘    │   └──────────────────────┘      │ │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Decisões-chave

### 1. `@supabase/ssr` (não `auth-helpers-nextjs`)

O `@supabase/auth-helpers-nextjs` está depreciado. O `@supabase/ssr` é o caminho canônico para App Router com três fábricas específicas de contexto: `createServerClient` (RSC + actions), `createBrowserClient` (componentes cliente) e uma variante para middleware.

### 2. RSC para leitura, Server Actions para escrita — sem rotas de API

O MVP não tem requisitos de tempo real. RSC + Server Actions elimina 100% do boilerplate de rotas de API, mantém os segredos no lado do servidor, e `revalidatePath()` lida com a invalidação do cache após mutações. Um SPA equivalente teria ~60% a mais de código sem ganho funcional.

### 3. Zod na fronteira da Server Action

A primeira instrução de cada Server Action é `Schema.safeParse(formData)`. Esta é a barreira em tempo de execução contra códigos gerados por IA que enviem entradas malformadas para o banco de dados — um modo de falha que o case pede explicitamente ("guardrails de IA").

### 4. Modelo de segurança baseado apenas em RLS — sem service role key no app

A `NEXT_PUBLIC_SUPABASE_ANON_KEY` é enviada ao navegador por design. A segurança é aplicada na camada do Postgres:

- Toda tabela possui `enable row level security`
- `auth.role() = 'authenticated'` protege SELECT e escrita
- `auth.uid() = author_id` protege o INSERT em `startup_updates`

Se o código do app tivesse um bug que permitisse tráfego anônimo chamar uma Server Action, o banco de dados ainda recusaria a operação. **Defesa em profundidade.**

### 5. Grupos de rotas `(auth)` e `(authed)` para separação de layout

`(auth)` hospeda o `/login` (público). `(authed)` hospeda tudo o que é protegido e fornece o shell do app com cabeçalho + sign-out. O middleware redireciona tráfego não autenticado de `(authed)` para `/login` antes que qualquer componente de página seja executado.

### 6. Sem suite formal de testes para o MVP — dívida técnica honesta e explícita

Tempo limitado a 6h. TypeScript strict + Zod + smoke test manual é a barreira escolhida. Documentado em [`TODO.md`](../TODO.md). A linguagem do case-brief é *"saber quando aceitar um hack e quando refatorar"* — este é o hack explícito e defendido.

---

## Fluxo de dados

### Leitura (Renderização do Dashboard)

```
1. Browser faz GET /
2. middleware.ts atualiza o cookie da sessão
3. (authed)/layout.tsx verifica auth → redireciona para /login se não houver usuário
4. (authed)/page.tsx (RSC) chama listStartups()
5. listStartups → createClient() → supabase.from('startups').select(...)
6. RLS avalia auth.role() = 'authenticated' em cada linha
7. Linhas mapeadas → StartupCard → HTML enviado ao navegador
   (zero buscas no lado do cliente)
```

### Escrita (Criar atualização)

```
1. Usuário envia <form action={createUpdate}>
2. Navegador faz POST do FormData (Next.js roteia para a action)
3. createUpdate:
   a. CreateUpdateSchema.safeParse — Fronteira Zod
   b. supabase.auth.getUser() — barreira de autenticação
   c. INSERT em startup_updates — verificação RLS auth.uid() = author_id
   d. UPDATE startups (parent) risk_level + updated_at
   e. revalidatePath('/startups/[id]') e '/'
4. Navegador recebe o redirecionamento/atualização; RSC renderiza novamente
```

### Auth (Magic link)

```
1. Usuário envia e-mail no /login → Server Action signIn
2. supabase.auth.signInWithOtp({ emailRedirectTo: SITE_URL + '/auth/callback' })
3. Supabase Auth envia e-mail; usuário clica no link
4. Navegador acessa /auth/callback?code=...
5. route.ts: supabase.auth.exchangeCodeForSession(code)
6. Cookie é definido; redireciona para /
7. Trigger handle_new_user cria a linha do perfil no primeiro login
```

---

## Modelo de segurança

| Camada | Contra o que protege | Como |
|-------|--------------------------|---|
| **Cookie (HttpOnly + Secure)** | Roubo de token via XSS | Padrões do `@supabase/ssr` |
| **Middleware** | Usuários não autenticados acessando páginas protegidas | Redireciona para `/login` antes da renderização |
| **Verificação auth no Layout** | Invocação direta de RSC pulando o middleware | `supabase.auth.getUser()` em `(authed)/layout.tsx` |
| **Verificação auth na Server Action** | POSTs de formulários forjados | `getUser()` seguido de `redirect('/login')` se nulo |
| **Schema Zod** | Entrada malformada atingindo o BD | `safeParse` antes de qualquer chamada ao banco |
| **RLS nas tabelas** | Abuso da anon-key de qualquer fonte | Políticas na camada do Postgres em todas as tabelas |
| **redirect_to bloqueado** | Redirecionamentos abertos | `NEXT_PUBLIC_SITE_URL` é o único alvo de redirecionamento permitido |
| **Sem service role key** | Escalação de privilégios | O app nunca detém uma chave que ignore o RLS |

---

## Observabilidade

- **Logging**: `console.error('<action> failed:', error.message, { context })` em todas as fronteiras de I/O. Vercel captura stdout/stderr automaticamente.
- **Métricas**: Métricas de requisição padrão da Vercel. Sem métricas customizadas no MVP.
- **Rastreamento (Tracing)**: Fora do escopo. Veja [`TODO.md`](../TODO.md) para o plano de OpenTelemetry.

---

## Trade-offs aceitos

| Decisão | Trade-off |
|---|---|
| Sem testes formais | Entrega mais rápida; risco: regressão em mudanças. Mitigado por TS strict + Zod + smoke manual. |
| Perfil único | Economia de ~30min; todos são administradores. Caminho de migração documentado no PRD §8. |
| Atualizações append-only | Sem UI de edição/exclusão; histórico imutável. Listado no TODO. |
| Leituras apenas via RSC | Sem tempo real; mutações exigem navegação/refresh. `revalidatePath` cobre isso. |
| `NEXT_PUBLIC_*` para ANON_KEY | Público por design; a segurança é o RLS, não o segredo da chave. |
