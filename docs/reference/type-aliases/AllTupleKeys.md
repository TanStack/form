---
id: AllTupleKeys
title: AllTupleKeys
---

# Type Alias: AllTupleKeys\<T\>

```ts
type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never;
```

Defined in: [packages/form-core/src/util-types.ts:82](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L82)

## Type Parameters

### T

`T`
