---
id: Readable
title: Readable
---

# Interface: Readable\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:19

## Extends

- [`Subscribable`](Subscribable.md)\<`T`\>

## Extended by

- [`BaseAtom`](BaseAtom.md)
- [`InternalBaseAtom`](InternalBaseAtom.md)

## Type Parameters

### T

`T`

## Properties

### get

```ts
get: () => T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:20

#### Returns

`T`

***

### subscribe

```ts
subscribe: (observer) => Subscription & (next, error?, complete?) => Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:17

#### Inherited from

[`Subscribable`](Subscribable.md).[`subscribe`](Subscribable.md#subscribe)
