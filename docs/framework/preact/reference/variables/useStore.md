---
id: useStore
title: useStore
---

# ~~Variable: useStore~~

```ts
const useStore: <TSource, TSelected>(source, selector?, compare?) => TSelected;
```

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.2\_preact@10.29.8/node\_modules/@tanstack/preact-store/dist/useStore.d.ts:12

Deprecated alias for [useSelector](../functions/useSelector.md).

## Type Parameters

### TSource

`TSource`

### TSelected

`TSelected` = `NoInfer`\<`TSource`\>

## Parameters

### source

#### get

() => `TSource`

#### subscribe

(`listener`) => `object`

### selector?

(`snapshot`) => `TSelected`

### compare?

(`a`, `b`) => `boolean`

## Returns

`TSelected`

## Example

```tsx
const count = useStore(counterStore, (state) => state.count)
```

## Deprecated

Use `useSelector` instead.
