---
id: useStore
title: useStore
---

# Function: useStore()

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): TSelected
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

`TSelected`

### Defined in

node\_modules/.pnpm/@tanstack+react-store@0.7.0\_react-dom@18.3.1\_react@18.3.1\_\_react@18.3.1/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:7

## Call Signature

```ts
function useStore<TState, TSelected>(store, selector?): TSelected
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

`TSelected`

### Defined in

node\_modules/.pnpm/@tanstack+react-store@0.7.0\_react-dom@18.3.1\_react@18.3.1\_\_react@18.3.1/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:8
