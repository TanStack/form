---
id: DeepKeysOfType
title: DeepKeysOfType
---

# Type Alias: DeepKeysOfType\<TData, TValue\>

```ts
type DeepKeysOfType<TData, TValue> = Extract<DeepKeysAndValues<TData>, AnyDeepKeyAndValue<string, TValue>>["key"];
```

Defined in: [packages/form-core/src/util-types.ts:177](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L177)

The keys of an object or array, deeply nested and only with a value of TValue

## Type Parameters

### TData

`TData`

### TValue

`TValue`
