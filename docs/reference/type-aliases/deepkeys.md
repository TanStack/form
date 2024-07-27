---
id: DeepKeys
title: DeepKeys
---

# Type Alias: DeepKeys\<T, TDepth\>

```ts
type DeepKeys<T, TDepth>: TDepth["length"] extends 5 ? never : unknown extends T ? PrefixFromDepth<string, TDepth> : T extends readonly any[] & IsTuple<T> ? PrefixTupleAccessor<T, AllowedIndexes<T>, TDepth> : T extends any[] ? PrefixArrayAccessor<T, [...TDepth, any]> : T extends Date ? never : T extends object ? PrefixObjectAccessor<T, TDepth> : T extends string | number | boolean | bigint ? "" : never;
```

The keys of an object or array, deeply nested.

## Type Parameters

• **T**

• **TDepth** *extends* `any`[] = []

## Defined in

[packages/form-core/src/util-types.ts:85](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/util-types.ts#L85)
