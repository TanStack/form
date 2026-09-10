---
id: Atom
title: Atom
---

# Interface: Atom\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:29

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

### set

```ts
set: (fn) => void & (value) => void;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:31

Sets the value of the atom using a function.

***

### subscribe

```ts
subscribe: (observer) => Subscription & (next, error?, complete?) => Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:17

#### Inherited from

[`BaseAtom`](BaseAtom.md).[`subscribe`](BaseAtom.md#subscribe)
