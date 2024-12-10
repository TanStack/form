---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TState, TSelected, TUpdater>(store, selector?): Accessor<TSelected>
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

`Accessor`\<`TSelected`\>

## Defined in

node\_modules/.pnpm/@tanstack+solid-store@0.6.0\_solid-js@1.9.3/node\_modules/@tanstack/solid-store/dist/esm/index.d.ts:8
