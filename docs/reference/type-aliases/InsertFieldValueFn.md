---
id: InsertFieldValueFn
title: InsertFieldValueFn
---

# Type Alias: InsertFieldValueFn\<TFormData\>

```ts
type InsertFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, index, value, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:190](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L190)

Inserts an element at an index in an array field.

Inserting at the array length appends the element. An invalid index or a
runtime value that is not an array produces a warning and leaves the value
unchanged.

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

The insertion index, from `0` through `array.length`.

### value

[`ArrayFieldElement`](ArrayFieldElement.md)\<`TFormData`, `TFieldName`\>

The element to insert.

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

Controls metadata updates and whether validation runs.

## Returns

`void`

## Example

```ts
// items: ['first', 'second']
formApi.insertFieldValue('items', 1, 'new item')
// items: ['first', 'new item', 'second']
```
