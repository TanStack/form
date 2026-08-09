---
id: useAtom
title: useAtom
---

# Function: useAtom()

```ts
function useAtom<TValue>(atom, options?): [Readonly<Ref<TValue, TValue>>, (fn) => void & (value) => void];
```

Defined in: node\_modules/.pnpm/@tanstack+vue-store@0.11.0\_vue@3.6.0-rc.2\_typescript@6.0.3\_/node\_modules/@tanstack/vue-store/dist/useAtom.d.ts:20

Returns the current atom ref together with a setter.

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

\[`Readonly`\<`Ref`\<`TValue`, `TValue`\>\>, (`fn`) => `void` & (`value`) => `void`\]

## Example

```ts
const [count, setCount] = useAtom(countAtom)

setCount((prev) => prev + 1)
console.log(count.value)
```
