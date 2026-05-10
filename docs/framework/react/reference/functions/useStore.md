---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TAtom, T>(
   atom, 
   selector, 
   compare?): T;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.9.1\_react-dom@19.1.0\_react@19.1.0\_\_react@19.1.0/node\_modules/@tanstack/react-store/dist/esm/useStore.d.ts:2

## Type Parameters

### TAtom

`TAtom` *extends* `AnyAtom` \| `undefined`

### T

`T`

## Parameters

### atom

`TAtom`

### selector

(`snapshot`) => `T`

### compare?

(`a`, `b`) => `boolean`

## Returns

`T`
