---
id: DeepKeyAndValueArray
title: DeepKeyAndValueArray
---

# Type Alias: DeepKeyAndValueArray\<TParent, T, TAcc\>

```ts
type DeepKeyAndValueArray<TParent, T, TAcc> = DeepKeysAndValuesImpl<NonNullable<T[number]>, ArrayDeepKeyAndValue<TParent, T>, 
  | TAcc
| ArrayDeepKeyAndValue<TParent, T>>;
```

Defined in: [packages/form-core/src/util-types.ts:41](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L41)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)

### T

`T` *extends* `ReadonlyArray`\<`any`\>

### TAcc

`TAcc`
