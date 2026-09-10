---
id: FilterFieldValuesFn
title: FilterFieldValuesFn
---

# Type Alias: FilterFieldValuesFn\<TFormData\>

```ts
type FilterFieldValuesFn<TFormData> = <TFieldName>(arrayFieldName, predicate, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:277](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L277)

Keeps the elements that satisfy a predicate.

A runtime value that is not an array produces a warning and is left
unchanged. By default, the update marks the array field as touched and
dirty, notifies change listeners, and runs change validation.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Type Parameters

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

## Parameters

### arrayFieldName

`TFieldName`

The array field path.

### predicate

[`ArrayFieldPredicate`](ArrayFieldPredicate.md)\<`TFormData`, `TFieldName`\>

Called with each element, its original index, and the
array. Return `true` to keep the element.

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md) & `object`

Controls metadata updates and validation. `thisArg` sets the
predicate's `this` value.

## Returns

`void`

## Example

```ts
// items: [1, 2, 3, 4]
formApi.filterFieldValues('items', (item) => item % 2 === 0)
// items: [2, 4]
```
