---
id: ReplaceFieldValueFn
title: ReplaceFieldValueFn
---

```ts
type ReplaceFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, index, value, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:278](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L278)

Replaces the element at an index in an array field.

An invalid index or a runtime value that is not an array produces a warning
and leaves the value unchanged.

By default, the update marks the array field as touched and dirty, notifies
change listeners, and runs change validation.

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

### index

`number`

The index to replace, from `0` through `array.length - 1`.

### value

[`ArrayFieldElement`](ArrayFieldElement.md)\<`TFormData`, `TFieldName`\>

The new element.

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

Controls metadata updates and whether validation runs.

## Returns

`void`

## Example

```ts
// items: ['first', 'second', 'third']
formApi.replaceFieldValue('items', 1, 'new item')
// items: ['first', 'new item', 'third']
```
