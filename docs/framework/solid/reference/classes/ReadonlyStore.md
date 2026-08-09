---
id: ReadonlyStore
title: ReadonlyStore
---

# Class: ReadonlyStore\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:22

## Type Parameters

### T

`T`

## Implements

- `Omit`\<[`Store`](Store.md)\<`T`\>, `"setState"` \| `"actions"`\>

## Constructors

### Constructor

```ts
new ReadonlyStore<T>(getValue): ReadonlyStore<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:24

#### Parameters

##### getValue

(`prev?`) => `T`

#### Returns

`ReadonlyStore`\<`T`\>

### Constructor

```ts
new ReadonlyStore<T>(initialValue): ReadonlyStore<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:25

#### Parameters

##### initialValue

`T`

#### Returns

`ReadonlyStore`\<`T`\>

## Accessors

### state

#### Get Signature

```ts
get state(): T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:26

##### Returns

`T`

#### Implementation of

```ts
Omit.state
```

## Methods

### get()

```ts
get(): T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:27

#### Returns

`T`

#### Implementation of

```ts
Omit.get
```

***

### subscribe()

```ts
subscribe(observerOrFn): Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:28

#### Parameters

##### observerOrFn

[`Observer`](../type-aliases/Observer.md)\<`T`\> \| ((`value`) => `void`)

#### Returns

[`Subscription`](../interfaces/Subscription.md)

#### Implementation of

```ts
Omit.subscribe
```
