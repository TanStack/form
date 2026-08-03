---
id: ArrayFieldPredicate
title: ArrayFieldPredicate
---

# Type Alias: ArrayFieldPredicate()\<TFormData, TFieldName\>

```ts
type ArrayFieldPredicate<TFormData, TFieldName> = (value, index, array) => boolean;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:23](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L23)

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

## Parameters

### value

[`ArrayFieldElement`](ArrayFieldElement.md)\<`TFormData`, `TFieldName`\>

### index

`number`

### array

[`ArrayFieldValue`](ArrayFieldValue.md)\<`TFormData`, `TFieldName`\>

## Returns

`boolean`
