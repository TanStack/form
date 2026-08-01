---
id: DeepKeysWhereValueIncludes
title: DeepKeysWhereValueIncludes
---

# Type Alias: DeepKeysWhereValueIncludes\<TData, TValue\>

```ts
type DeepKeysWhereValueIncludes<TData, TValue> = DeepKeysAndValues<TData> extends infer TDeepKeyAndValue ? TDeepKeyAndValue extends AnyDeepKeyAndValue ? Extract<NonNullable<TDeepKeyAndValue["value"]>, TValue> extends never ? never : TDeepKeyAndValue["key"] : never : never;
```

Defined in: [deep-keys.public.ts:224](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/deep-keys.public.ts#L224)

## Type Parameters

### TData

`TData`

### TValue

`TValue`
