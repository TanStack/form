---
id: ReadonlyAtom
title: ReadonlyAtom
---

# Interface: ReadonlyAtom\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:49

An atom that is read-only and cannot be set.

## Example

```ts
const atom = createAtom(() => 42);
// @ts-expect-error - Cannot set a readonly atom
atom.set(43);
```

## Extends

- [`BaseAtom`](BaseAtom.md)\<`T`\>

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

[`BaseAtom`](BaseAtom.md).[`get`](BaseAtom.md#get)

***

### subscribe

```ts
subscribe: (observer) => Subscription & (next, error?, complete?) => Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:17

#### Inherited from

[`BaseAtom`](BaseAtom.md).[`subscribe`](BaseAtom.md#subscribe)
