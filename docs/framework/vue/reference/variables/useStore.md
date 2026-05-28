---
id: useStore
title: useStore
---

# ~~Variable: useStore()~~

```ts
const useStore: <TSource, TSelected>(source, selector?, compare?) => Readonly<Ref<TSelected>>;
```

Defined in: node\_modules/.pnpm/@tanstack+vue-store@0.11.0\_vue@3.5.34\_typescript@5.9.3\_/node\_modules/@tanstack/vue-store/dist/useStore.d.ts:14

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

`Readonly`\<`Ref`\<`TSelected`\>\>

## Example

```ts
const count = useStore(counterStore, (state) => state.count)
```

## Deprecated

Use `useSelector` instead.
