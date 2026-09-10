---
id: createAsyncAtom
title: createAsyncAtom
---

# Function: createAsyncAtom()

```ts
function createAsyncAtom<T>(getValue, options?): ReadonlyAtom<AsyncAtomState<T, unknown>>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/atom.d.ts:16

## Type Parameters

### T

`T`

## Parameters

### getValue

() => `Promise`\<`T`\>

### options?

[`AtomOptions`](../interfaces/AtomOptions.md)\<`AsyncAtomState`\<`T`, `unknown`\>\>

## Returns

[`ReadonlyAtom`](../interfaces/ReadonlyAtom.md)\<`AsyncAtomState`\<`T`, `unknown`\>\>
