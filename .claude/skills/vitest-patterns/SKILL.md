---
name: vitest-patterns
description: Vitest testing patterns for TypeScript/Node.js projects. Covers mocking, async tests, coverage, and Testing Library for React.
allowed-tools: Read, Grep, Glob
---

# Vitest Patterns

You are a testing expert applying Vitest best practices for TypeScript Node.js and React projects.

## When Activated

- Writing or reviewing Vitest tests
- Setting up test configuration
- Mocking modules, functions, or timers
- Testing React components with Testing Library
- Configuring test coverage

## Core Patterns

### Basic Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ActivityStore', () => {
  let store: ActivityStore;

  beforeEach(() => {
    store = new ActivityStore();   // fresh instance per test
  });

  it('stores activity by file path', () => {
    store.add({ type: 'read-start', filePath: 'src/index.ts' });
    expect(store.get('src/index.ts')).toHaveLength(1);
  });

  it('returns empty array for unknown paths', () => {
    expect(store.get('unknown.ts')).toEqual([]);
  });
});
```

### Mocking Functions

```typescript
import { vi, expect } from 'vitest';

// Mock function
const onActivity = vi.fn();
store.subscribe(onActivity);
store.add(event);
expect(onActivity).toHaveBeenCalledOnce();
expect(onActivity).toHaveBeenCalledWith(expect.objectContaining({ type: 'read-start' }));

// Spy on existing method
const spy = vi.spyOn(store, 'get');
store.get('src/index.ts');
expect(spy).toHaveBeenCalledWith('src/index.ts');
spy.mockRestore();   // always restore
```

### Mocking Modules

```typescript
// Mock entire module
vi.mock('./websocket', () => ({
  createConnection: vi.fn().mockReturnValue({ send: vi.fn(), close: vi.fn() }),
}));

// Mock with factory for complex cases
vi.mock('express', async (importOriginal) => {
  const actual = await importOriginal<typeof import('express')>();
  return { ...actual, Router: vi.fn(() => ({ get: vi.fn(), post: vi.fn() })) };
});
```

### Async Tests

```typescript
// Always return the promise or use async/await
it('fetches agent data', async () => {
  const data = await fetchAgents('http://localhost:5174');
  expect(data).toHaveLength(3);
});

// Resolves/rejects matchers
await expect(fetchAgents('bad-url')).rejects.toThrow('Failed to fetch');
await expect(fetchAgents('http://ok')).resolves.toEqual([]);
```

### Fake Timers (For setTimeout/setInterval)

```typescript
import { vi } from 'vitest';

it('reconnects after 3 seconds', () => {
  vi.useFakeTimers();
  const connect = vi.fn();
  setupReconnect(connect, 3000);

  vi.advanceTimersByTime(3000);
  expect(connect).toHaveBeenCalledOnce();

  vi.useRealTimers();  // always restore
});
```

### React + Testing Library

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

it('calls onSelect with agent id when clicked', async () => {
  const onSelect = vi.fn();
  render(<AgentCard agent={{ agentId: 'abc123', displayName: 'Claude 1' }} onSelect={onSelect} />);

  fireEvent.click(screen.getByRole('button', { name: /select/i }));
  await waitFor(() => expect(onSelect).toHaveBeenCalledWith('abc123'));
});

it('shows loading state', async () => {
  render(<AgentList loading={true} />);
  expect(screen.getByRole('status')).toBeInTheDocument();

  // Wait for content to appear
  await screen.findByText('Claude 1');
});
```

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',        // For React/DOM tests
    globals: true,               // describe/it/expect without imports
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist', '**/*.test.ts'],
    },
    setupFiles: ['./test/setup.ts'],  // Global test setup
  },
});
```

## Anti-Patterns

```
DANGEROUS                           FIX
sleep(1000) in tests                vi.useFakeTimers() + advanceTimersByTime
Testing implementation details      Test behavior/output, not internal state
Not restoring mocks                 vi.restoreAllMocks() in afterEach
Hard-coded test data                Factory functions / fixtures
Nested describes >3 levels deep     Extract to separate describe blocks
expect(thing).toBeTruthy()          Be specific: toEqual, toHaveLength, etc.
```

## Coverage Commands

```bash
# Run with coverage
npx vitest run --coverage

# Watch mode
npx vitest

# UI mode (browser)
npx vitest --ui
```
