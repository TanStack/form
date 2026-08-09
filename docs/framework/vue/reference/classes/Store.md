---
id: Store
title: Store
---

# Class: Store\<T, TActions\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:11

## Type Parameters

### T

`T`

### TActions

`TActions` *extends* [`StoreActionMap`](../type-aliases/StoreActionMap.md) = `never`

## Constructors

### Constructor

```ts
new Store<T, TActions>(getValue): Store<T, TActions>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:14

#### Parameters

##### getValue

(`prev?`) => `T`

#### Returns

`Store`\<`T`, `TActions`\>

### Constructor

```ts
new Store<T, TActions>(initialValue): Store<T, TActions>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:15

#### Parameters

##### initialValue

`T`

#### Returns

`Store`\<`T`, `TActions`\>

### Constructor

```ts
new Store<T, TActions>(initialValue, actionsFactory): Store<T, TActions>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:16

#### Parameters

##### initialValue

`NonFunction`\<`T`\>

##### actionsFactory

[`StoreActionsFactory`](../type-aliases/StoreActionsFactory.md)\<`T`, `TActions`\>

#### Returns

`Store`\<`T`, `TActions`\>

## Properties

### actions

```ts
readonly actions: TActions;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:13

## Accessors

### state

#### Get Signature

```ts
get state(): T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:18

##### Returns

`T`

## Methods

### get()

```ts
get(): T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:19

#### Returns

`T`

***

### setState()

```ts
setState(updater): void;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:17

#### Parameters

##### updater

(`prev`) => `T`

#### Returns

`void`

***

### subscribe()

```ts
subscribe(observerOrFn): Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/store.d.ts:20

#### Parameters

##### observerOrFn

[`Observer`](../type-aliases/Observer.md)\<`T`\> \| ((`value`) => `void`)

#### Returns

[`Subscription`](../interfaces/Subscription.md)
