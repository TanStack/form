---
id: Subscribable
title: Subscribable
---

# Interface: Subscribable\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:16

## Extends

- [`InteropSubscribable`](InteropSubscribable.md)\<`T`\>

## Extended by

- [`BaseAtom`](BaseAtom.md)
- [`InternalBaseAtom`](InternalBaseAtom.md)
- [`Readable`](Readable.md)

## Type Parameters

### T

`T`

## Properties

### subscribe

```ts
subscribe: (observer) => Subscription & (next, error?, complete?) => Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:17

#### Overrides

[`InteropSubscribable`](InteropSubscribable.md).[`subscribe`](InteropSubscribable.md#subscribe)
