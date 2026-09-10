---
id: ArrayFieldName
title: ArrayFieldName
---

# Type Alias: ArrayFieldName\<TFormData\>

```ts
type ArrayFieldName<TFormData> = DeepKeysWhereValueIncludes<TFormData, ReadonlyArray<any>>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:16](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L16)

Field paths whose value type includes a mutable or readonly array.

A path is included when at least one member of a union is an array, including
when the value can also be `null` or `undefined`.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
