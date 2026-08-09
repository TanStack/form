---
id: createAtom
title: createAtom
---

# Function: createAtom()

## Call Signature

```ts
function createAtom<T>(getValue, options?): ReadonlyAtom<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/atom.d.ts:17

### Type Parameters

#### T

`T`

### Parameters

#### getValue

(`prev?`) => `T`

#### options?

[`AtomOptions`](../interfaces/AtomOptions.md)\<`T`\>

### Returns

[`ReadonlyAtom`](../interfaces/ReadonlyAtom.md)\<`T`\>

## Call Signature

```ts
function createAtom<T>(initialValue, options?): Atom<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/atom.d.ts:18

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T`

#### options?

[`AtomOptions`](../interfaces/AtomOptions.md)\<`T`\>

### Returns

[`Atom`](../interfaces/Atom.md)\<`T`\>
