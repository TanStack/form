---
id: useStore
title: useStore
---

# Function: useStore()

```ts
function useStore<TState, TSelected, TUpdater>(store, selector?): Readonly<Ref<TSelected>>
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

`Readonly`\<`Ref`\<`TSelected`\>\>

## Defined in

node\_modules/.pnpm/@tanstack+vue-store@0.6.0\_vue@3.5.12\_typescript@5.7.2\_/node\_modules/@tanstack/vue-store/dist/esm/index.d.ts:8
