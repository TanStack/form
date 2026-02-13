---
id: useStore
title: useStore
---

# Function: useStore()

## Call Signature

```ts
function useStore<TState, TSelected>(
   store, 
   selector?, 
options?): Accessor<TSelected>;
```

Defined in: node\_modules/.pnpm/@tanstack+solid-store@0.8.0\_solid-js@1.9.9/node\_modules/@tanstack/solid-store/dist/esm/index.d.ts:12

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

#### options?

`UseStoreOptions`\<`TSelected`\>

### Returns

`Accessor`\<`TSelected`\>

## Call Signature

```ts
function useStore<TState, TSelected>(
   store, 
   selector?, 
options?): Accessor<TSelected>;
```

Defined in: node\_modules/.pnpm/@tanstack+solid-store@0.8.0\_solid-js@1.9.9/node\_modules/@tanstack/solid-store/dist/esm/index.d.ts:13

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

#### options?

`UseStoreOptions`\<`TSelected`\>

### Returns

`Accessor`\<`TSelected`\>
