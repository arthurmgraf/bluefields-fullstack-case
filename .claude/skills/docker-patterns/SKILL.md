---
name: docker-patterns
description: Docker best practices for Python and Node.js services. Multi-stage builds, layer caching, security hardening, and docker-compose patterns.
allowed-tools: Read, Grep, Glob
---

# Docker Patterns

You are a containerization expert applying Docker best practices for Python and Node.js production services.

## When Activated

- Writing Dockerfiles for Python or Node.js services
- Creating docker-compose configurations
- Optimizing image build times or sizes
- Reviewing containers for security issues

## Multi-Stage Build (Always Use)

### Python

```dockerfile
# Stage 1: build — has gcc, build tools, full pip
FROM python:3.11-slim AS builder
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
  && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: runtime — minimal, no build tools
FROM python:3.11-slim AS runtime
RUN useradd --system --uid 1001 appuser
WORKDIR /app
COPY --from=builder /install /usr/local
COPY src/ src/
RUN chown -R appuser:appuser /app
USER appuser
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
CMD ["python", "-m", "src.main"]
```

### Node.js

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci --include=dev
COPY src/ src/
RUN npm run build

FROM node:20-alpine AS runtime
USER node
WORKDIR /app
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/dist/ dist/
RUN npm ci --omit=dev
ENV NODE_ENV=production
EXPOSE 5174
CMD ["node", "dist/index.js"]
```

## Layer Caching — Order Matters

```dockerfile
# GOOD: deps before source code (deps change rarely)
COPY requirements.txt .          # ← changes rarely → cached
RUN pip install -r requirements.txt
COPY src/ .                      # ← changes often → invalidates only here

# BAD: source before deps (every code change rebuilds deps)
COPY . .
RUN pip install -r requirements.txt   # ← rebuilds on every src change
```

## .dockerignore (Always Create)

```text
.git
.env
.env.*
node_modules
__pycache__
*.pyc
.pytest_cache
.mypy_cache
dist
tests/
.claude/
*.md
```

## docker-compose Patterns

```yaml
services:
  app:
    build:
      context: .
      target: builder    # Use builder stage for dev (has devDeps + hot reload)
    ports:
      - "8080:8080"
    volumes:
      - ./src:/app/src:ro          # Hot reload
      - /app/node_modules          # Anonymous volume prevents host override
    environment:
      DB_URL: postgresql://app:${DB_PASSWORD}@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD:-localdev}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:    # Named volume persists between docker-compose down/up
```

## Security Rules

```text
CRITICAL
[ ] Non-root USER in final stage (useradd or node user)
[ ] .dockerignore excludes .env files
[ ] No secrets in ENV instructions (inject at runtime)
[ ] Pin base image versions (python:3.11-slim not python:latest)

IMPORTANT
[ ] Multi-stage: build tools not in runtime image
[ ] HEALTHCHECK on HTTP/DB services
[ ] Minimal base image (slim or alpine variants)
[ ] apt-get clean && rm -rf /var/lib/apt/lists/* after installs
```

## Anti-Patterns

```
DANGEROUS                           FIX
USER root in final stage            Add non-root user
Secrets in ENV instruction          Inject via -e flag or secrets manager
COPY . . before RUN pip install     Copy requirements.txt first
:latest base image tag              Pin to specific version
No .dockerignore                    Create one, exclude .env + tests
CMD as string                       Use array: CMD ["node", "app.js"]
Installing dev deps in runtime      Use multi-stage or --omit=dev
```

## Useful Commands

```bash
# Build and tag
docker build -t myapp:latest .

# Build specific stage
docker build --target builder -t myapp:dev .

# Inspect layers (find bloat)
docker history myapp:latest

# Check image size
docker images myapp

# Run with env file (never bake secrets)
docker run --env-file .env myapp:latest

# Compose up with build
docker compose up --build

# Prune unused images
docker image prune -f
```
