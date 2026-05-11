---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TState, TSelected>(
   store, 
   selector?, 
options?): Readonly<Ref<TSelected>>;
```

Defined in: node\_modules/.pnpm/@tanstack+vue-store@0.9.1\_vue@3.5.16\_typescript@5.9.3\_/node\_modules/@tanstack/vue-store/dist/esm/index.d.ts:8

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

`Readonly`\<`Ref`\<`TSelected`\>\>
