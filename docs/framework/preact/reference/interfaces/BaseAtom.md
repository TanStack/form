---
id: BaseAtom
title: BaseAtom
---

# Interface: BaseAtom\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:22

## Extends

- [`Subscribable`](Subscribable.md)\<`T`\>.[`Readable`](Readable.md)\<`T`\>

## Extended by

- [`Atom`](Atom.md)
- [`ReadonlyAtom`](ReadonlyAtom.md)

## Type Parameters

### T

`T`

## Properties

### get

```ts
get: () => T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:20

#### Returns

`T`

#### Inherited from

[`Readable`](Readable.md).[`get`](Readable.md#get)

***

### subscribe

```ts
subscribe: (observer) => Subscription & (next, error?, complete?) => Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:17

#### Inherited from

[`Subscribable`](Subscribable.md).[`subscribe`](Subscribable.md#subscribe)
