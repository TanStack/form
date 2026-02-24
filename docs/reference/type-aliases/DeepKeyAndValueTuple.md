---
id: DeepKeyAndValueTuple
title: DeepKeyAndValueTuple
---

# Type Alias: DeepKeyAndValueTuple\<TParent, T, TAcc, TAllKeys\>

```ts
type DeepKeyAndValueTuple<TParent, T, TAcc, TAllKeys> = TAllKeys extends any ? DeepKeysAndValuesImpl<NonNullable<T[TAllKeys]>, TupleDeepKeyAndValue<TParent, T, TAllKeys>, 
  | TAcc
  | TupleDeepKeyAndValue<TParent, T, TAllKeys>> : never;
```

Defined in: [packages/form-core/src/util-types.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L67)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)

### T

`T` *extends* `ReadonlyArray`\<`any`\>

### TAcc

`TAcc`

### TAllKeys

`TAllKeys` *extends* [`AllTupleKeys`](AllTupleKeys.md)\<`T`\> = [`AllTupleKeys`](AllTupleKeys.md)\<`T`\>
