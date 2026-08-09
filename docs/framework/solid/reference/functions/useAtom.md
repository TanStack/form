---
id: useAtom
title: useAtom
---

# Function: useAtom()

```ts
function useAtom<TValue>(atom, options?): [Accessor<TValue>, (fn) => void & (value) => void];
```

Defined in: node\_modules/.pnpm/@tanstack+solid-store@0.11.1\_solid-js@1.9.14/node\_modules/@tanstack/solid-store/dist/useAtom.d.ts:23

Returns the current atom accessor together with a setter.

Use this when a component needs to both read and update the same writable
atom.

## Type Parameters

### TValue

`TValue`

## Parameters

### atom

[`Atom`](../interfaces/Atom.md)\<`TValue`\>

### options?

[`UseSelectorOptions`](../interfaces/UseSelectorOptions.md)\<`TValue`\>

## Returns

\[`Accessor`\<`TValue`\>, (`fn`) => `void` & (`value`) => `void`\]

## Example

```tsx
const [count, setCount] = useAtom(countAtom)

return (
  <button type="button" onClick={() => setCount((prev) => prev + 1)}>
    {count()}
  </button>
)
```
