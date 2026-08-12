---
id: DeepKeysWhereValueIncludes
title: DeepKeysWhereValueIncludes
---

# Type Alias: DeepKeysWhereValueIncludes\<TData, TValue\>

```ts
type DeepKeysWhereValueIncludes<TData, TValue> = DeepKeysAndValues<TData> extends infer TDeepKeyAndValue ? TDeepKeyAndValue extends AnyDeepKeyAndValue ? Extract<NonNullable<TDeepKeyAndValue["value"]>, TValue> extends never ? never : TDeepKeyAndValue["key"] : never : never;
```

Defined in: [deep-keys.public.ts:221](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/deep-keys.public.ts#L221)

## Type Parameters

### TData

`TData`

### TValue

`TValue`
