---
id: DeepKeyAndValueObject
title: DeepKeyAndValueObject
---

# Type Alias: DeepKeyAndValueObject\<TParent, T, TAcc, TAllKeys\>

```ts
type DeepKeyAndValueObject<TParent, T, TAcc, TAllKeys> = TAllKeys extends any ? DeepKeysAndValuesImpl<NonNullable<T[TAllKeys]>, ObjectDeepKeyAndValue<TParent, T, TAllKeys>, 
  | TAcc
  | ObjectDeepKeyAndValue<TParent, T, TAllKeys>> : never;
```

Defined in: [packages/form-core/src/util-types.ts:106](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L106)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)

### T

`T`

### TAcc

`TAcc`

### TAllKeys

`TAllKeys` *extends* [`AllObjectKeys`](AllObjectKeys.md)\<`T`\> = [`AllObjectKeys`](AllObjectKeys.md)\<`T`\>
