---
id: useCreateStore
title: useCreateStore
---

# Function: useCreateStore()

## Call Signature

```ts
function useCreateStore<T>(getValue): ReadonlyStore<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.1\_preact@10.29.8/node\_modules/@tanstack/preact-store/dist/useCreateStore.d.ts:30

Creates a stable store instance for the lifetime of the component.

Pass an initial value to create a writable store, or a getter function to
create a readonly derived store. This mirrors [createStore](createStore.md), but only
creates the store once per component mount.

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
function Counter() {
  const counterStore = useCreateStore({ count: 0 })
  const count = useSelector(counterStore, (state) => state.count)
  const setState = useSetValue(counterStore)

  return (
    <button
      type="button"
      onClick={() => setState((state) => ({ ...state, count: state.count + 1 }))}
    >
      {count}
    </button>
  )
}
```

## Call Signature

```ts
function useCreateStore<T>(initialValue): Store<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.1\_preact@10.29.8/node\_modules/@tanstack/preact-store/dist/useCreateStore.d.ts:31

Creates a stable store instance for the lifetime of the component.

Pass an initial value to create a writable store, or a getter function to
create a readonly derived store. This mirrors [createStore](createStore.md), but only
creates the store once per component mount.

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
function Counter() {
  const counterStore = useCreateStore({ count: 0 })
  const count = useSelector(counterStore, (state) => state.count)
  const setState = useSetValue(counterStore)

  return (
    <button
      type="button"
      onClick={() => setState((state) => ({ ...state, count: state.count + 1 }))}
    >
      {count}
    </button>
  )
}
```

## Call Signature

```ts
function useCreateStore<T, TActions>(initialValue, actions): Store<T, TActions>;
```

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.1\_preact@10.29.8/node\_modules/@tanstack/preact-store/dist/useCreateStore.d.ts:32

Creates a stable store instance for the lifetime of the component.

Pass an initial value to create a writable store, or a getter function to
create a readonly derived store. This mirrors [createStore](createStore.md), but only
creates the store once per component mount.

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
function Counter() {
  const counterStore = useCreateStore({ count: 0 })
  const count = useSelector(counterStore, (state) => state.count)
  const setState = useSetValue(counterStore)

  return (
    <button
      type="button"
      onClick={() => setState((state) => ({ ...state, count: state.count + 1 }))}
    >
      {count}
    </button>
  )
}
```
