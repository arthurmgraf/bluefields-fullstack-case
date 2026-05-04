---
name: typescript-patterns
description: TypeScript 5.x best practices for Node.js and full-stack development. Covers strict mode, interfaces, generics, utility types, and module patterns.
allowed-tools: Read, Grep, Glob
---

# TypeScript Patterns

You are a TypeScript expert applying strict-mode patterns for production Node.js and browser code.

## When Activated

- Writing TypeScript code for backends or frontends
- Reviewing TypeScript for type safety issues
- Converting JavaScript to TypeScript
- Designing shared type contracts between services

## Core Rules

### Always Use Strict Mode

```json
// tsconfig.json minimum
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Interfaces vs Types

```typescript
// interface — for objects and class contracts (extensible)
interface AgentState {
  agentId: string;
  displayName: string;
  isThinking: boolean;
}

// type — for unions, intersections, primitives
type EventType = 'read-start' | 'read-end' | 'write-start' | 'write-end';
type Nullable<T> = T | null;
```

### Discriminated Unions (Never Use string Enums)

```typescript
// GOOD — exhaustive at compile time
type ActivityEvent =
  | { type: 'read-start'; filePath: string }
  | { type: 'write-start'; filePath: string; content: string }
  | { type: 'thinking-start'; toolName: string };

function handle(event: ActivityEvent) {
  switch (event.type) {
    case 'read-start': return processRead(event.filePath);
    case 'write-start': return processWrite(event.filePath, event.content);
    case 'thinking-start': return processThinking(event.toolName);
    // TypeScript catches missing cases here
  }
}
```

### Generics — Keep Simple

```typescript
// Generic Result type (avoids throwing for expected failures)
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Generic store
class Store<T extends { id: string }> {
  private items = new Map<string, T>();
  add(item: T): void { this.items.set(item.id, item); }
  get(id: string): T | undefined { return this.items.get(id); }
}
```

### Utility Types (Use These)

```typescript
Partial<T>           // All fields optional
Required<T>          // All fields required
Readonly<T>          // All fields readonly
Pick<T, 'a' | 'b'>  // Select specific fields
Omit<T, 'secret'>    // Remove specific fields
Record<K, V>         // Dictionary type
ReturnType<typeof fn> // Infer return type
Parameters<typeof fn> // Infer param types
```

### Async Patterns

```typescript
// Always type async functions
async function fetchData(url: string): Promise<AgentState[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return response.json() as Promise<AgentState[]>;
}

// Error handling — never swallow
try {
  const data = await fetchData('/api/agents');
} catch (error) {
  // error is unknown — narrow it
  const message = error instanceof Error ? error.message : String(error);
  console.error('Failed to fetch:', message);
}
```

## Patterns to Flag

```
DANGEROUS                          SAFE ALTERNATIVE
as any                             Type guard or unknown
! non-null assertion               Optional chaining ?.
Catching error: any                Catching error: unknown
string enum                        Discriminated union
interface with optional + any      Specific typed fields
Nested callbacks                   async/await
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Interfaces | PascalCase, no `I` | `AgentState` |
| Types | PascalCase | `EventType` |
| Functions | camelCase | `handleActivity` |
| Constants | UPPER_SNAKE | `MAX_CLIENTS` |
| Files | kebab-case | `activity-store.ts` |
| Generic params | Single capital | `T`, `K`, `V` |
