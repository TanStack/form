---
id: useStore
title: useStore
---

# Function: useStore()

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): Accessor<TSelected>
```

### Type Parameters

• **TState**

• **TSelected** = `NoInfer`\<`TState`\>

### Parameters

#### store

`Store`\<`TState`, `any`\>

#### selector?

(`state`) => `TSelected`

### Returns

`Accessor`\<`TSelected`\>

### Defined in

node\_modules/.pnpm/@tanstack+solid-store@0.7.0\_solid-js@1.9.3/node\_modules/@tanstack/solid-store/dist/esm/index.d.ts:8

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): Accessor<TSelected>
```

### Type Parameters

• **TState**

• **TSelected** = `NoInfer`\<`TState`\>

### Parameters

#### store

`Derived`\<`TState`, `any`\>

#### selector?

(`state`) => `TSelected`

### Returns

`Accessor`\<`TSelected`\>

### Defined in

node\_modules/.pnpm/@tanstack+solid-store@0.7.0\_solid-js@1.9.3/node\_modules/@tanstack/solid-store/dist/esm/index.d.ts:9
