---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TState, TSelected, TUpdater>(store, selector?): TSelected
```

## Type Parameters

• **TState**

• **TSelected** = `NoInfer`\<`TState`\>

• **TUpdater** *extends* `AnyUpdater` = `AnyUpdater`

## Parameters

### store

`Store`\<`TState`, `TUpdater`\>

### selector?

(`state`) => `TSelected`

## Returns

`TSelected`

## Defined in

node\_modules/.pnpm/@tanstack+react-store@0.6.1\_react-dom@18.3.1\_react@18.3.1\_\_react@18.3.1/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:7
