---
id: useStore
title: useStore
---

# Function: useStore()

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): Readonly<Ref<TSelected>>
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

`Readonly`\<`Ref`\<`TSelected`\>\>

### Defined in

node\_modules/.pnpm/@tanstack+vue-store@0.7.0\_vue@3.5.12\_typescript@5.7.2\_/node\_modules/@tanstack/vue-store/dist/esm/index.d.ts:8

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): Readonly<Ref<TSelected>>
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

`Readonly`\<`Ref`\<`TSelected`\>\>

### Defined in

node\_modules/.pnpm/@tanstack+vue-store@0.7.0\_vue@3.5.12\_typescript@5.7.2\_/node\_modules/@tanstack/vue-store/dist/esm/index.d.ts:9
