# Architecture

> System design, key decisions, and the security model in 5 minutes of reading.

---

## System diagram

```text
┌──────────────────────────────────────────────────────────────────────┐
│                          USER (browser)                               │
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
│  │                                │ (Zod validate)                │  │
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
│  │  │  - JWT issuance  │    │   │ profiles · startups  │      │ │  │
│  │  │                  │    │   │ startup_updates      │      │ │  │
│  │  └──────────────────┘    │   └──────────────────────┘      │ │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Key decisions

### 1. `@supabase/ssr` (not `auth-helpers-nextjs`)

`@supabase/auth-helpers-nextjs` is deprecated. `@supabase/ssr` is the canonical path for App Router with three context-specific factories: `createServerClient` (RSC + actions), `createBrowserClient` (client components), and a middleware variant.

### 2. RSC for reads, Server Actions for writes — no API routes

The MVP has no real-time requirements. RSC + Server Actions removes 100% of API-route boilerplate, keeps secrets server-side, and `revalidatePath()` handles cache invalidation after mutations. An equivalent SPA would have ~60% more code for no functional gain.

### 3. Zod at the Server Action boundary

Every Server Action's first instruction is `Schema.safeParse(formData)`. This is the runtime guardrail against AI-generated code passing malformed input to the database — a failure mode the case explicitly asks about ("guardrails de IA").

### 4. RLS-only security model — no service role key in the app

The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is shipped to the browser by design. Security is enforced at the Postgres layer:

- Every table has `enable row level security`
- `auth.role() = 'authenticated'` gates SELECT and write
- `auth.uid() = author_id` gates `startup_updates` INSERT

If the app code had a bug that allowed anonymous traffic to call a Server Action, the database would still refuse the operation. **Defense in depth.**

### 5. Route groups `(auth)` and `(authed)` for layout separation

`(auth)` hosts `/login` (public). `(authed)` hosts everything protected and provides the app shell with header + sign-out. Middleware redirects unauthenticated traffic out of `(authed)` to `/login` before any page component runs.

### 6. No formal test suite for the MVP — explicit honest debt

Time-boxed at 6h. TypeScript strict + Zod + manual smoke is the chosen guardrail. Documented in [`TODO.md`](../TODO.md). The case-brief language is *"saber quando aceitar um hack e quando refatorar"* — this is the explicit, defended hack.

---

## Data flow

### Read (Dashboard render)

```
1. Browser GET /
2. middleware.ts refreshes session cookie
3. (authed)/layout.tsx checks auth → redirects to /login if no user
4. (authed)/page.tsx (RSC) calls listStartups()
5. listStartups → createClient() → supabase.from('startups').select(...)
6. RLS evaluates auth.role() = 'authenticated' on every row
7. Rows mapped → StartupCard → HTML streamed to browser
   (zero client-side fetches)
```

### Write (Create update)

```
1. User submits <form action={createUpdate}>
2. Browser POSTs FormData (Next.js routes to the action)
3. createUpdate:
   a. CreateUpdateSchema.safeParse — Zod boundary
   b. supabase.auth.getUser() — auth gate
   c. INSERT into startup_updates — RLS auth.uid() = author_id check
   d. UPDATE parent startups.risk_level + updated_at
   e. revalidatePath('/startups/[id]') and '/'
4. Browser receives the redirect/refresh; RSC re-renders
```

### Auth (Magic link)

```
1. User submits email on /login → signIn Server Action
2. supabase.auth.signInWithOtp({ emailRedirectTo: SITE_URL + '/auth/callback' })
3. Supabase Auth sends email; user clicks the link
4. Browser hits /auth/callback?code=...
5. route.ts: supabase.auth.exchangeCodeForSession(code)
6. Cookie set; redirect to /
7. handle_new_user trigger creates profile row on first login
```

---

## Security model

| Layer | What it protects against | How |
|-------|--------------------------|---|
| **Cookie (HttpOnly + Secure)** | XSS token theft | `@supabase/ssr` defaults |
| **Middleware** | Unauth users hitting protected pages | Redirects to `/login` before render |
| **Layout auth check** | Direct RSC invocation skipping middleware | `supabase.auth.getUser()` in `(authed)/layout.tsx` |
| **Server Action auth check** | Forged form POSTs | `getUser()` then `redirect('/login')` if null |
| **Zod schema** | Malformed input reaching the DB | `safeParse` before any DB call |
| **RLS on tables** | Anon-key abuse from any source | Postgres-layer policies on every table |
| **Locked redirect_to** | Open redirects | `NEXT_PUBLIC_SITE_URL` is the only allowed redirect target |
| **No service role key** | Privilege escalation | App never holds a key that bypasses RLS |

---

## Observability

- **Logging**: `console.error('<action> failed:', error.message, { context })` at every I/O boundary. Vercel captures stdout/stderr automatically.
- **Metrics**: Vercel default request metrics. No custom metrics in MVP.
- **Tracing**: Out of scope. See [`TODO.md`](../TODO.md) for OpenTelemetry plan.

---

## Trade-offs accepted

| Decision | Trade-off |
|---|---|
| No formal tests | Faster delivery; risk: regression on changes. Mitigated by TS strict + Zod + manual smoke. |
| Single role | Saved ~30min; everyone is admin. Migration path documented in PRD §8. |
| Append-only updates | No edit/delete UI; immutable history. Listed in TODO. |
| RSC-only reads | No real-time; mutations require navigation/refresh. `revalidatePath` covers it. |
| `NEXT_PUBLIC_*` for ANON_KEY | Public by design; security is RLS, not key secrecy. |
