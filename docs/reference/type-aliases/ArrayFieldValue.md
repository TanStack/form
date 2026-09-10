---
id: ArrayFieldValue
title: ArrayFieldValue
---

# Type Alias: ArrayFieldValue\<TFormData, TFieldName\>

```ts
type ArrayFieldValue<TFormData, TFieldName> = DeepValue<TFormData, TFieldName>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:30](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L30)

Complete value type at an array field path.

This preserves any nullish or non-array members that share the field's value
union.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.
