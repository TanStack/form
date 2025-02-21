---
id: UnwrapOneLevelOfArray
title: UnwrapOneLevelOfArray
---

# Type Alias: UnwrapOneLevelOfArray\<T\>

```ts
type UnwrapOneLevelOfArray<T> = T extends infer U[] ? U : T;
```

Defined in: [packages/form-core/src/util-types.ts:4](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L4)

## Type Parameters

• **T**
