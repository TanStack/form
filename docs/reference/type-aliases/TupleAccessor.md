---
id: TupleAccessor
title: TupleAccessor
---

# Type Alias: TupleAccessor\<TParent, TKey\>

```ts
type TupleAccessor<TParent, TKey> = `${TParent["key"] extends never ? "" : TParent["key"]}[${TKey}]`;
```

Defined in: [packages/form-core/src/util-types.ts:51](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L51)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)

### TKey

`TKey` *extends* `string`
