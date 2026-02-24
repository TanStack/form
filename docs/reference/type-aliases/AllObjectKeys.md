---
id: AllObjectKeys
title: AllObjectKeys
---

# Type Alias: AllObjectKeys\<T\>

```ts
type AllObjectKeys<T> = T extends any ? keyof T & string | number : never;
```

Defined in: [packages/form-core/src/util-types.ts:80](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L80)

## Type Parameters

### T

`T`
