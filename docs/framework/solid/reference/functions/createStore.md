---
id: createStore
title: createStore
---

# Function: createStore()

## Call Signature

```ts
function createStore<T>(getValue): ReadonlyStore<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/store.d.ts:30

### Type Parameters

#### T

`T`

### Parameters

#### getValue

(`prev?`) => `T`

### Returns

[`ReadonlyStore`](../classes/ReadonlyStore.md)\<`T`\>

## Call Signature

```ts
function createStore<T>(initialValue): Store<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/store.d.ts:31

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T`

### Returns

[`Store`](../classes/Store.md)\<`T`\>

## Call Signature

```ts
function createStore<T, TActions>(initialValue, actions): Store<T, TActions>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/store.d.ts:32

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
