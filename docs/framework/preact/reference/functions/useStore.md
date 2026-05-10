---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TState, TSelected>(
   store, 
   selector?, 
   options?): TSelected;
```

Defined in: [packages/preact-form/src/useStore.ts:34](https://github.com/TanStack/form/blob/main/packages/preact-form/src/useStore.ts#L34)

## Type Parameters

### TState

`TState`

### TSelected

`TSelected` = `NoInfer`\<`TState`\>

## Parameters

### store

`StoreLike`\<`TState`\>

### selector?

(`state`) => `TSelected`

### options?

`UseStoreOptions`\<`TSelected`\>

## Returns

`TSelected`
