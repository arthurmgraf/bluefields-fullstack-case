# QUALITY-REVIEW-SKILL — Skill Reutilizável de Revisão de Código

> Entregável #6 do case Bluefields. Este documento é um **ponteiro para o arquivo canônico** da skill, que vive no diretório padrão do Claude Code para skills serem instaláveis em outros projetos.

---

## Localização da skill

**Arquivo canônico:** [`../.claude/skills/code-review/SKILL.md`](../.claude/skills/code-review/SKILL.md)

Esse caminho não é arbitrário — é a convenção do Claude Code para skills (`.claude/skills/<nome>/SKILL.md`). Manter a skill nesse path significa que **qualquer outro projeto pode instalá-la com um único `cp`** (ou `npx skills add`), exatamente como o brief do case pede ("reutilizável").

---

## Resumo da skill

| Atributo | Valor |
|---|---|
| **Nome** | `code-review` |
| **Tipo** | Drop-in Claude Code skill (markdown puro, sem deps) |
| **Foco** | Revisão estruturada de código gerado por IA com classificação de severidade |
| **Stack alvo** | TypeScript / Next.js 14 / Supabase / Server Actions (com seção "Customizing for your stack") |
| **Quando invocar** | Após IA gerar >50 LOC, antes de PR, ao tocar Server Action ou migration, ao tocar fronteira de segurança |

---

## O que a skill cobre

### 1. Segurança — alinhamento com OWASP Top 10

Cada item do A01–A10 mapeado para um check concreto no contexto Next.js + Supabase. Exemplo: A01 (Broken Access Control) vira "toda Server Action chama `supabase.auth.getUser()` e redireciona se nulo".

### 2. Type safety

Zero `any`, Zod em toda fronteira externa, tipos gerados do Supabase em uso, sem `as` para silenciar erros.

### 3. Correção de framework (Next.js 14)

RSC por padrão, `revalidatePath` após mutação, sem importar módulos server em client, formulários funcionam sem JS.

### 4. Observabilidade

Erros com contexto estruturado, sem stack trace vazando para usuário, sem fallback silencioso.

### 5. Higiene

Nomes auto-documentados, sem código comentado, imports limpos.

---

## Saída da skill

A skill produz uma tabela markdown agrupada por severidade que cabe no body de um PR:

```markdown
| Severity | File:Line | Finding | Suggested fix |
|----------|-----------|---------|---------------|
```

Para CRITICAL e HIGH, o "Suggested fix" é **código concreto**, não descrição. Cita códigos OWASP onde aplicável.

---

## Por que esta skill existe

> Citação direta do `SKILL.md` §Why this skill exists:
>
> *Código gerado por IA parece certo à primeira vista. Os bugs se escondem em: checagens de auth presentes mas no lugar errado, políticas RLS que parecem estritas mas permitem `using (true)`, type assertions que silenciam o compilador em vez de corrigir o tipo, chamadas de `revalidatePath` faltando que produzem UI fantasma com dados velhos.*
>
> *Um checklist é a defesa mais barata possível. Este arquivo é esse checklist.*

A skill foi **escrita a partir dos 4 erros reais documentados em `AI_USAGE.md`** — cada erro vira um item do checklist. Não é um framework genérico de PR review; é destilação de incidentes reais.

---

## Como instalar em outro projeto

```bash
# A partir da raiz de qualquer projeto Next.js + Supabase:
mkdir -p .claude/skills/code-review
curl -L https://raw.githubusercontent.com/<seu-fork>/.../SKILL.md \
  -o .claude/skills/code-review/SKILL.md

# Ou simplesmente:
cp /caminho/para/este/projeto/.claude/skills/code-review/SKILL.md \
   ./.claude/skills/code-review/SKILL.md
```

A partir daí, no Claude Code, `/code-review` invoca a skill.

---

## Para customizar para outro stack

`SKILL.md` §"Customizing for your stack" tem instruções específicas. As seções **Type safety** e **Severity → Location → Finding → Fix** são portáveis sem alteração; **Framework correctness** e **Security** precisam de ajuste por stack.
