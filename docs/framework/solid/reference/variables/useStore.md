---
id: useStore
title: useStore
---

# ~~Variable: useStore()~~

```ts
const useStore: <TSource, TSelected>(source, selector?, compare?) => Accessor<TSelected>;
```

Defined in: node\_modules/.pnpm/@tanstack+solid-store@0.11.0\_solid-js@1.9.13/node\_modules/@tanstack/solid-store/dist/useStore.d.ts:14

Deprecated alias for useSelector.

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

`Accessor`\<`TSelected`\>

## Example

```tsx
const count = useStore(counterStore, (state) => state.count)
```

## Deprecated

Use `useSelector` instead.
