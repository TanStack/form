---
id: ObjectValue
title: ObjectValue
---

# Type Alias: ObjectValue\<TParent, T, TKey\>

```ts
type ObjectValue<TParent, T, TKey> = T[TKey] | Nullable<TParent["value"]>;
```

Defined in: [packages/form-core/src/util-types.ts:91](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L91)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)

### T

`T`

### TKey

`TKey` *extends* [`AllObjectKeys`](AllObjectKeys.md)\<`T`\>
