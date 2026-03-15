---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TState, TSelected>(
   store, 
   selector?, 
options?): Accessor<TSelected>;
```

Defined in: node\_modules/.pnpm/@tanstack+solid-store@0.9.1\_solid-js@1.9.11/node\_modules/@tanstack/solid-store/dist/esm/index.d.ts:8

## Type Parameters

### TState

`TState`

### TSelected

`TSelected` = `NoInfer`\<`TState`\>

## Parameters

### store

`Atom`\<`TState`\> | `ReadonlyAtom`\<`TState`\>

### selector?

(`state`) => `TSelected`

### options?

`UseStoreOptions`\<`TSelected`\>

## Returns

`Accessor`\<`TSelected`\>
