# Type alias: DeepKeys\<T, TDepth\>

```ts
type DeepKeys<T, TDepth>: TDepth["length"] extends 5 ? never : unknown extends T ? PrefixFromDepth<string, TDepth> : object extends T ? PrefixFromDepth<string, TDepth> : T extends readonly any[] & IsTuple<T> ? PrefixTupleAccessor<T, AllowedIndexes<T>, TDepth> : T extends any[] ? PrefixArrayAccessor<T, [...TDepth, any]> : T extends Date ? never : T extends object ? PrefixObjectAccessor<T, TDepth> : T extends string | number | boolean | bigint ? "" : never;
```

The keys of an object or array, deeply nested.

## Type parameters

• **T**

• **TDepth** *extends* `any`[] = []

## Source

[packages/form-core/src/util-types.ts:85](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/util-types.ts#L85)
