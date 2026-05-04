---
name: github-actions-patterns
description: GitHub Actions best practices for Python + Node.js CI/CD. Covers workflow structure, caching, secrets, matrix builds, and security.
allowed-tools: Read, Grep, Glob
---

# GitHub Actions Patterns

You are a CI/CD expert applying GitHub Actions best practices for multi-language Python and TypeScript projects.

## When Activated

- Creating or modifying `.github/workflows/*.yml` files
- Debugging failing CI pipelines
- Adding test, lint, security, or deploy jobs
- Configuring secrets, caching, or matrix builds

## Workflow Structure

### Correct Job Order (Fail Fast)

```
lint (fast) → test (parallel) → security (parallel) → deploy (gated)
```

Jobs that don't need each other should run in parallel. `needs:` creates dependencies.

### Trigger Configuration

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:     # Manual trigger (always include for debugging)
```

## Python CI Pattern

```yaml
test-python:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        cache: 'pip'                   # Caches ~/.cache/pip
    - run: pip install -e ".[dev]"
    - run: ruff check .
    - run: pytest --cov=src --cov-report=xml -v
    - uses: actions/upload-artifact@v4
      if: failure()                    # Upload test results on failure
      with:
        name: test-results
        path: junit.xml
```

## Node.js/TypeScript CI Pattern

```yaml
test-typescript:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'                   # Caches ~/.npm
    - run: npm ci
    - run: npx tsc --noEmit
    - run: npm test -- --coverage
```

## Caching Rules

```yaml
# pip — use setup-python cache: 'pip' (simplest)
- uses: actions/setup-python@v5
  with:
    cache: 'pip'

# npm — use setup-node cache: 'npm' (simplest)
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

# Custom paths — when you need more control
- uses: actions/cache@v4
  with:
    path: .venv
    key: ${{ runner.os }}-venv-${{ hashFiles('requirements*.txt') }}
```

## Secrets Management

```yaml
# NEVER hardcode — always reference secrets
env:
  API_KEY: ${{ secrets.API_KEY }}          # Set in GitHub repo settings
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Auto-provided — no setup needed

# Minimum permissions
permissions:
  contents: read
  pull-requests: write   # Only add what you actually need
```

## Security Scanning

```yaml
security:
  needs: lint-python
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        cache: 'pip'
    - run: pip install bandit pip-audit
    - run: bandit -r src/ -ll -x tests/
    - run: pip-audit --require-hashes -r requirements.txt
```

## Matrix Build

```yaml
test:
  strategy:
    matrix:
      python-version: ['3.11', '3.12']
    fail-fast: false   # Run all matrix jobs even if one fails
  steps:
    - uses: actions/setup-python@v5
      with:
        python-version: ${{ matrix.python-version }}
```

## Common Fixes

| Issue | Fix |
|-------|-----|
| `pip install` fails with gcc error | Add `apt-get install build-essential` |
| `npm ci` fails — no lockfile | Commit `package-lock.json` or use `npm install` |
| Tests pass locally, fail in CI | Add missing env vars to workflow `env:` |
| Workflow not triggering | Check `branches:` filter matches actual branch name |
| `GITHUB_TOKEN` permission denied | Add `permissions: contents: write` |
| Slow workflow | Add `cache: 'pip'` or `cache: 'npm'` to setup actions |

## Anti-Patterns

```
DANGEROUS                          FIX
Hardcoded secrets in YAML          Use ${{ secrets.NAME }}
Using @latest for third-party      Pin to @v4 or commit SHA
pull_request_target + checkout     Security risk — review docs first
No cache configuration             Adds 2-3 min per run
All jobs in sequence               Parallelize independent jobs
No fail-fast on matrix             Add fail-fast: false
```
