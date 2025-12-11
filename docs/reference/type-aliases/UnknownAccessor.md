---
id: UnknownAccessor
title: UnknownAccessor
---

# Type Alias: UnknownAccessor\<TParent\>

```ts
type UnknownAccessor<TParent> = TParent["key"] extends never ? string : `${TParent["key"]}.${string}`;
```

Defined in: [packages/form-core/src/util-types.ts:119](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L119)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md)
