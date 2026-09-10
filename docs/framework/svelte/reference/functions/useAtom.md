---
id: useAtom
title: useAtom
---

# Function: useAtom()

```ts
function useAtom<TValue>(atom, options?): [{
  current: TValue;
}, (fn) => void & (value) => void];
```

Defined in: node\_modules/.pnpm/@tanstack+svelte-store@0.12.1\_svelte@5.56.8\_@typescript-eslint+types@8.66.0\_/node\_modules/@tanstack/svelte-store/dist/useAtom.d.ts:16

Returns the current atom holder together with a setter.

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

\[\{
  `current`: `TValue`;
\}, (`fn`) => `void` & (`value`) => `void`\]

## Example

```ts
const [count, setCount] = useAtom(countAtom)
setCount((prev) => prev + 1)
console.log(count.current)
```
