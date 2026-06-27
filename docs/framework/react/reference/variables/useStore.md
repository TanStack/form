---
id: useStore
title: useStore
---

# ~~Variable: useStore()~~

```ts
const useStore: <TSource, TSelected>(source, selector?, compare?) => TSelected;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.1.0\_react@19.1.0\_\_react@19.1.0/node\_modules/@tanstack/react-store/dist/useStore.d.ts:12

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

`TSelected`

## Example

```tsx
const count = useStore(counterStore, (state) => state.count)
```

## Deprecated

Use `useSelector` instead.
