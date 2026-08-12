---
id: MoveFieldValueFn
title: MoveFieldValueFn
---

# Type Alias: MoveFieldValueFn\<TFormData\>

```ts
type MoveFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, fromIndex, toIndex, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:129](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L129)

Moves an element to another index in an array field.

Passing equal indices does nothing. Invalid indices or a runtime value that
is not an array produce a warning and leave the value unchanged.

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

### fromIndex

`number`

The current index, from `0` through `array.length - 1`.

### toIndex

`number`

The destination index, from `0` through `array.length - 1`.

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

Controls metadata updates and whether validation runs.

## Returns

`void`

## Example

```ts
// items: ['first', 'second', 'third']
formApi.moveFieldValue('items', 0, 2)
// items: ['second', 'third', 'first']
```
