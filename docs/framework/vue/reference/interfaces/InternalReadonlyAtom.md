---
id: InternalReadonlyAtom
title: InternalReadonlyAtom
---

# Interface: InternalReadonlyAtom\<T\>

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:37

## Extends

- [`InternalBaseAtom`](InternalBaseAtom.md)\<`T`\>.`ReactiveNode`

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

#### Inherited from

[`InternalBaseAtom`](InternalBaseAtom.md).[`_snapshot`](InternalBaseAtom.md#_snapshot)

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

#### Inherited from

[`InternalBaseAtom`](InternalBaseAtom.md).[`_update`](InternalBaseAtom.md#_update)

***

### deps?

```ts
optional deps?: Link;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/alien.d.ts:3

#### Inherited from

```ts
ReactiveNode.deps
```

***

### depsTail?

```ts
optional depsTail?: Link;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/alien.d.ts:4

#### Inherited from

```ts
ReactiveNode.depsTail
```

***

### flags

```ts
flags: ReactiveFlags;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/alien.d.ts:7

#### Inherited from

```ts
ReactiveNode.flags
```

***

### get

```ts
get: () => T;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:20

#### Returns

`T`

#### Inherited from

[`InternalBaseAtom`](InternalBaseAtom.md).[`get`](InternalBaseAtom.md#get)

***

### subs?

```ts
optional subs?: Link;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/alien.d.ts:5

#### Inherited from

```ts
ReactiveNode.subs
```

***

### subscribe

```ts
subscribe: (observer) => Subscription & (next, error?, complete?) => Subscription;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/types.d.ts:17

#### Inherited from

[`InternalBaseAtom`](InternalBaseAtom.md).[`subscribe`](InternalBaseAtom.md#subscribe)

***

### subsTail?

```ts
optional subsTail?: Link;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.0/node\_modules/@tanstack/store/dist/alien.d.ts:6

#### Inherited from

```ts
ReactiveNode.subsTail
```
