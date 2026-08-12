---
id: ArrayFieldPredicate
title: ArrayFieldPredicate
---

# Type Alias: ArrayFieldPredicate\<TFormData, TFieldName\>

```ts
type ArrayFieldPredicate<TFormData, TFieldName> = (value, index, array) => boolean;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:65](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L65)

Selects which elements `filterFieldValues` keeps.

Return `true` to keep an element or `false` to remove it. The callback
receives the element's original index and the array before filtering.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

## Parameters

### value

[`ArrayFieldElement`](ArrayFieldElement.md)\<`TFormData`, `TFieldName`\>

The current element.

### index

`number`

The element's index in the original array.

### array

[`ArrayFieldValue`](ArrayFieldValue.md)\<`TFormData`, `TFieldName`\>

The array being filtered.

## Returns

`boolean`

## Example

```ts
// items: [1, 2, 3, 4]
formApi.filterFieldValues('items', (item) => item % 2 === 0)
// items: [2, 4]
```
