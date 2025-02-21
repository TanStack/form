---
id: useStore
title: useStore
---

# Function: useStore()

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): TSelected
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.7.0\_react-dom@19.0.0\_react@19.0.0\_\_react@19.0.0/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:7

### Type Parameters

• **TState**

• **TSelected** = `NoInfer`\<`TState`\>

### Parameters

#### store

`Store`\<`TState`, `any`\>

#### selector?

(`state`) => `TSelected`

### Returns

`TSelected`

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): TSelected
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.7.0\_react-dom@19.0.0\_react@19.0.0\_\_react@19.0.0/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:8

### Type Parameters

• **TState**

• **TSelected** = `NoInfer`\<`TState`\>

### Parameters

#### store

`Derived`\<`TState`, `any`\>

#### selector?

(`state`) => `TSelected`

### Returns

`TSelected`
