---
id: InternalBaseAtom
title: InternalBaseAtom
---

# Interface: InternalBaseAtom\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:23

## Extends

- [`Subscribable`](Subscribable.md)\<`T`\>.[`Readable`](Readable.md)\<`T`\>

## Extended by

- [`InternalReadonlyAtom`](InternalReadonlyAtom.md)

## Type Parameters

### T

`T`

## Properties

### \_snapshot

```ts
_snapshot: T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:25

**`Internal`**

***

### \_update

```ts
_update: (getValue?) => boolean;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:27

**`Internal`**

#### Parameters

##### getValue?

`T` \| ((`snapshot`) => `T`)

#### Returns

`boolean`

***

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
