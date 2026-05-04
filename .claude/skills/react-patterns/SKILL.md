---
name: react-patterns
description: React 18 best practices for hooks, components, performance, and Canvas animations. Use when building or reviewing React UI code.
allowed-tools: Read, Grep, Glob
---

# React Patterns

You are a React 18 expert applying modern hook patterns, performance optimization, and accessibility best practices.

## When Activated

- Writing or reviewing React components
- Building custom hooks
- Canvas/animation rendering (requestAnimationFrame)
- Real-time UI with WebSocket data
- Performance issues (too many re-renders)

## Hook Patterns

### useEffect — Correct Dependency Array

```typescript
// GOOD: cleanup + stable deps
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = handleMessage;
  return () => ws.close();   // cleanup is mandatory
}, [url]);                   // only re-run when url changes

// BAD: missing cleanup → memory leak
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = handleMessage;
  // no return — WebSocket never closed
}, [url]);
```

### useRef — For Non-Render State

```typescript
// Animation frame IDs, WebSocket instances, DOM nodes — don't trigger renders
const rafRef = useRef<number>(0);
const wsRef = useRef<WebSocket | null>(null);

// Stable callback ref (avoids stale closure without deps change)
const handlerRef = useRef(onMessage);
handlerRef.current = onMessage;
```

### useMemo + useCallback — Use Sparingly

```typescript
// useMemo: expensive computation
const filtered = useMemo(
  () => agents.filter(a => a.isThinking),
  [agents]  // only recompute when agents changes
);

// useCallback: stable fn reference for child component props
const handleSelect = useCallback(
  (id: string) => onSelect(id),
  [onSelect]
);

// NOT NEEDED for:
const double = useMemo(() => count * 2, [count]);  // trivial — just compute inline
```

### Canvas Animation Loop

```typescript
// Always cancel on unmount — never leave dangling requestAnimationFrame
useEffect(() => {
  let rafId: number;
  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // draw...
    rafId = requestAnimationFrame(draw);
  };
  rafId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(rafId);
}, [width, height]);
```

## Component Patterns

### Composition Over Props Drilling

```typescript
// INSTEAD OF passing 10 props down 3 levels, use children/slots
function Card({ header, children, footer }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">{header}</div>
      <div className="card-body">{children}</div>
      <div className="card-footer">{footer}</div>
    </div>
  );
}
```

### memo() — Only When Profiling Confirms

```typescript
// Wrap only when parent re-renders frequently and this component is expensive
export const AgentCard = memo(function AgentCard({ agent, onSelect }: Props) {
  // ...
});
```

## Performance Rules

```text
RENDERS
[ ] State as close to consumer as possible (avoid lifting unnecessarily)
[ ] Context split: fast-changing state in separate context from slow
[ ] Keys must be stable IDs (never array index in dynamic lists)
[ ] memo() + useCallback() only after profiling — premature optimization adds complexity

CANVAS
[ ] clearRect before every draw cycle
[ ] cancelAnimationFrame in useEffect cleanup
[ ] off-screen canvas for static backgrounds
[ ] limit draw complexity (batch operations)

WEBSOCKET
[ ] Single connection shared via Context (not per-component)
[ ] Reconnect logic with exponential backoff
[ ] Parse JSON in message handler, not during render
```

## Anti-Patterns

```
DANGEROUS                              FIX
useEffect with [] but reads state      Add state to deps or use useRef
Inline object/array as prop            useMemo or define outside component
setState in render body                Move to useEffect or event handler
Index as key for dynamic list          Use stable unique IDs
Direct DOM manipulation                useRef + effect
```
