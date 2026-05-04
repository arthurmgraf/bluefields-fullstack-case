# PROMPT: Team Agent Test — CI/CD + Docker + TypeScript Utils

> Teste de execução paralela com 3 agentes especializados.
> Cada agente cria um artefato real e independente para o template.

---

## Config

```yaml
mode: afk
quality_tier: production
max_iterations: 20
max_retries: 2
circuit_breaker: 3
small_steps: true
feedback_loops:
  - node --input-type=module --eval "import fs from 'fs'; ['VERIFY_PASS']" 2>/dev/null || true
team_size: 3
sandbox: none
```

---

## Objetivo

Adicionar 3 artefatos reais que estão **faltando** neste template:
1. Pipeline CI/CD para projetos Python + TypeScript
2. Dockerfile multi-stage para a aplicação Node.js (CodeMap server)
3. Utilitário TypeScript tipado para event emitting no CodeMap server

Cada tarefa é **completamente independente** — sem dependências entre si.

---

## Context

```
Repositório: template-claude-code
Stack: Python 3.11 + TypeScript 5.3 + React 18 + Express + WebSocket
Pastas chave:
  - codemap-tool/server/src/  (TypeScript Express + WebSocket)
  - codemap-tool/client/src/  (React 18 + Vite)
  - src/                      (Python, estrutura genérica)
  - infra/                    (scaffold Terraform)
  - .claude/                  (Claude Code ecosystem)

Arquivos de referência para o agente ler:
  - codemap-tool/server/src/index.ts   (Express server existente)
  - codemap-tool/server/src/types.ts   (interfaces existentes)
  - pyproject.toml                     (Python config)
  - .mcp.json                          (project structure)
```

---

## RISKY

> Nenhuma tarefa RISKY — todos os arquivos são novos (não sobrescrevem nada existente).

---

## CORE

- [x] @github-actions-specialist: Criar `.github/workflows/ci.yml`

  Pipeline CI/CD completo para o template:
  - Job `lint-python`: ruff check + ruff format --check (usa pyproject.toml)
  - Job `test-python`: pytest com coverage (usa pyproject.toml dev deps)
  - Job `lint-typescript`: tsc --noEmit no codemap-tool/
  - Job `test-typescript`: npm test no codemap-tool/server e codemap-tool/client
  - Job `security`: bandit + pip-audit em paralelo com os testes
  - Cache pip e npm configurados
  - workflow_dispatch para trigger manual
  - Permissions mínimos (contents: read)

  Verify: `node -e "require('fs').readFileSync('.github/workflows/ci.yml', 'utf8')" && echo PASS`

- [x] @docker-specialist: Criar `codemap-tool/Dockerfile` + `codemap-tool/.dockerignore`

  Dockerfile multi-stage para o CodeMap server (Node.js):
  - Stage `builder`: node:20-alpine, instala todas as deps, compila TypeScript
  - Stage `runtime`: node:20-alpine, non-root user (node), só prod deps
  - HEALTHCHECK em /api/health (porta 5174)
  - ENV NODE_ENV=production PORT=5174
  - EXPOSE 5174
  - CMD ["node", "dist/index.js"]

  .dockerignore deve excluir: node_modules, dist, *.test.ts, client/ (serve separado), .env

  Verify: `node -e "require('fs').readFileSync('codemap-tool/Dockerfile', 'utf8')" && echo PASS`

- [x] @typescript-developer: Criar `codemap-tool/server/src/event-bus.ts` + teste

  Utilitário de event bus tipado para uso interno no server:
  - Classe `EventBus<TEvents extends Record<string, unknown>>` genérica
  - Métodos: `on(event, handler)`, `off(event, handler)`, `emit(event, data)`, `once(event, handler)`
  - Type-safe: TypeScript deve saber os tipos dos dados em cada evento
  - Sem dependências externas (só Node.js built-ins)
  - Exportar instância singleton `eventBus` com os tipos do projeto

  Arquivo de teste: `codemap-tool/server/src/event-bus.test.ts` com:
  - Testa on/emit
  - Testa off (unsubscribe)
  - Testa once (dispara só uma vez)
  - Testa type safety (pelo menos comentado)

  Verify: `node -e "require('fs').readFileSync('codemap-tool/server/src/event-bus.ts', 'utf8')" && echo PASS`

---

## POLISH

- [x] Verificar que os 3 arquivos principais foram criados corretamente

  ```bash
  node -e "
  const fs = require('fs');
  const files = [
    '.github/workflows/ci.yml',
    'codemap-tool/Dockerfile',
    'codemap-tool/.dockerignore',
    'codemap-tool/server/src/event-bus.ts',
    'codemap-tool/server/src/event-bus.test.ts',
  ];
  let ok = 0, fail = 0;
  files.forEach(f => {
    try { fs.readFileSync(f); console.log('PASS ' + f); ok++; }
    catch(e) { console.log('FAIL ' + f); fail++; }
  });
  console.log(ok + '/' + files.length + ' files created');
  if (fail > 0) process.exit(1);
  "
  ```

- [x] Listar o que foi criado para o usuário revisar

---

## Acceptance Criteria

```text
[ ] .github/workflows/ci.yml existe e tem jobs lint-python, test-python, lint-typescript, test-typescript, security
[ ] codemap-tool/Dockerfile existe com multi-stage (builder + runtime)
[ ] codemap-tool/.dockerignore existe
[ ] codemap-tool/server/src/event-bus.ts existe e é TypeScript válido
[ ] codemap-tool/server/src/event-bus.test.ts existe
[ ] Nenhum arquivo existente foi modificado
```
