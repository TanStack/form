---
id: ArrayFieldElement
title: ArrayFieldElement
---

# Type Alias: ArrayFieldElement\<TFormData, TFieldName\>

```ts
type ArrayFieldElement<TFormData, TFieldName> = TryGetArrayElementType<ArrayFieldValue<TFormData, TFieldName>>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:41](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L41)

Element type extracted from the array member of an array field's value.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.
