---
id: useStore
title: useStore
---

# ~~Variable: useStore~~

```ts
const useStore: <TState, TSelected>(source, selector?, compare?) => object;
```

Defined in: node\_modules/.pnpm/@tanstack+svelte-store@0.12.1\_svelte@5.56.8\_@typescript-eslint+types@8.66.0\_/node\_modules/@tanstack/svelte-store/dist/useStore.d.ts:13

Deprecated alias for [useSelector](../functions/useSelector.md).

## Type Parameters

### TState

`TState`

### TSelected

`TSelected` = `NoInfer`\<`TState`\>

## Parameters

### source

  \| [`Atom`](../interfaces/Atom.md)\<`TState`\>
  \| [`ReadonlyAtom`](../interfaces/ReadonlyAtom.md)\<`TState`\>
  \| [`Store`](../classes/Store.md)\<`TState`, `any`\>
  \| [`ReadonlyStore`](../classes/ReadonlyStore.md)\<`TState`\>

### selector?

(`state`) => `TSelected`

### compare?

(`a`, `b`) => `boolean`

## Returns

`object`

### ~~current~~

```ts
readonly current: TSelected;
```

## Example

```ts
const count = useStore(counterStore, (state) => state.count)
console.log(count.current)
```

## Deprecated

Use `useSelector` instead.
