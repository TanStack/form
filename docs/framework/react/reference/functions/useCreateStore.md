---
id: useCreateStore
title: useCreateStore
---

# Function: useCreateStore()

## Call Signature

```ts
function useCreateStore<T>(getValue): ReadonlyStore<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.8\_react@19.2.8\_\_react@19.2.8/node\_modules/@tanstack/react-store/dist/useCreateStore.d.ts:17

Creates a stable store instance for the lifetime of the component.

Pass an initial value to create a writable store, or a getter function to
create a readonly derived store. This hook mirrors the overloads from
[createStore](createStore.md), but ensures the store is only created once per mount.

### Type Parameters

#### T

`T`

### Parameters

#### getValue

(`prev?`) => `T`

### Returns

[`ReadonlyStore`](../classes/ReadonlyStore.md)\<`T`\>

### Example

```tsx
const counterStore = useCreateStore({ count: 0 })
```

## Call Signature

```ts
function useCreateStore<T>(initialValue): Store<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.8\_react@19.2.8\_\_react@19.2.8/node\_modules/@tanstack/react-store/dist/useCreateStore.d.ts:18

Creates a stable store instance for the lifetime of the component.

Pass an initial value to create a writable store, or a getter function to
create a readonly derived store. This hook mirrors the overloads from
[createStore](createStore.md), but ensures the store is only created once per mount.

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T`

### Returns

[`Store`](../classes/Store.md)\<`T`\>

### Example

```tsx
const counterStore = useCreateStore({ count: 0 })
```

## Call Signature

```ts
function useCreateStore<T, TActions>(initialValue, actions): Store<T, TActions>;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.8\_react@19.2.8\_\_react@19.2.8/node\_modules/@tanstack/react-store/dist/useCreateStore.d.ts:19

Creates a stable store instance for the lifetime of the component.

Pass an initial value to create a writable store, or a getter function to
create a readonly derived store. This hook mirrors the overloads from
[createStore](createStore.md), but ensures the store is only created once per mount.

### Type Parameters

#### T

`T`

#### TActions

`TActions` *extends* [`StoreActionMap`](../type-aliases/StoreActionMap.md)

### Parameters

#### initialValue

`NonFunction`\<`T`\>

#### actions

[`StoreActionsFactory`](../type-aliases/StoreActionsFactory.md)\<`T`, `TActions`\>

### Returns

[`Store`](../classes/Store.md)\<`T`, `TActions`\>

### Example

```tsx
const counterStore = useCreateStore({ count: 0 })
```
