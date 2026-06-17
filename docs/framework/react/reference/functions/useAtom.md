---
id: useAtom
title: useAtom
---

# Function: useAtom()

```ts
function useAtom<TValue>(atom, options?): [TValue, (fn) => void & (value) => void];
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.7\_react@19.2.7\_\_react@19.2.7/node\_modules/@tanstack/react-store/dist/useAtom.d.ts:16

Returns the current atom value together with a stable setter.

This is the writable-atom convenience hook for components that need to both
read and update the same atom.

## Type Parameters

### TValue

`TValue`

## Parameters

### atom

[`Atom`](../interfaces/Atom.md)\<`TValue`\>

### options?

[`UseSelectorOptions`](../interfaces/UseSelectorOptions.md)\<`TValue`\>

## Returns

\[`TValue`, (`fn`) => `void` & (`value`) => `void`\]

## Example

```tsx
const [count, setCount] = useAtom(countAtom)
```
