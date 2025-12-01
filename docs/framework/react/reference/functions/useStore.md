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
   options?): TSelected;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.8.0\_react-dom@19.1.0\_react@19.1.0\_\_react@19.1.0/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:11

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

`TSelected`

## Call Signature

```ts
function useStore<TState, TSelected>(
   store, 
   selector?, 
   options?): TSelected;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.8.0\_react-dom@19.1.0\_react@19.1.0\_\_react@19.1.0/node\_modules/@tanstack/react-store/dist/esm/index.d.ts:12

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

`TSelected`
