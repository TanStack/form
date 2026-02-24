---
id: ObjectAccessor
title: ObjectAccessor
---

# Type Alias: ObjectAccessor\<TParent, TKey\>

```ts
type ObjectAccessor<TParent, TKey> = TParent["key"] extends never ? `${TKey}` : `${TParent["key"]}.${TKey}`;
```

Defined in: [packages/form-core/src/util-types.ts:84](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L84)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)

### TKey

`TKey` *extends* `string` \| `number`
