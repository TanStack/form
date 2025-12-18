---
id: useStore
title: useStore
---

# Function: useStore()

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): Readonly<Ref<TSelected>>;
```

Defined in: node\_modules/.pnpm/@tanstack+vue-store@0.7.7\_vue@3.5.16\_typescript@5.9.3\_/node\_modules/@tanstack/vue-store/dist/esm/index.d.ts:8

### Type Parameters

#### TState

`TState`

#### TSelected

`TSelected` = `NoInfer`\<`TState`\>

### Parameters

#### store

`Store`\<`TState`, `any`\>

#### selector?

(`state`) => `TSelected`

### Returns

`Readonly`\<`Ref`\<`TSelected`\>\>

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): Readonly<Ref<TSelected>>;
```

Defined in: node\_modules/.pnpm/@tanstack+vue-store@0.7.7\_vue@3.5.16\_typescript@5.9.3\_/node\_modules/@tanstack/vue-store/dist/esm/index.d.ts:9

### Type Parameters

#### TState

`TState`

#### TSelected

`TSelected` = `NoInfer`\<`TState`\>

### Parameters

#### store

`Derived`\<`TState`, `any`\>

#### selector?

(`state`) => `TSelected`

### Returns

`Readonly`\<`Ref`\<`TSelected`\>\>
