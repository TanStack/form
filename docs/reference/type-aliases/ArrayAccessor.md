---
id: ArrayAccessor
title: ArrayAccessor
---

# Type Alias: ArrayAccessor\<TParent\>

```ts
type ArrayAccessor<TParent> = `${TParent["key"] extends never ? "" : TParent["key"]}[${number}]`;
```

Defined in: [packages/form-core/src/util-types.ts:30](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L30)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)
