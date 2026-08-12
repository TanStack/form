---
id: RemoveFieldValueFn
title: RemoveFieldValueFn
---

# Type Alias: RemoveFieldValueFn\<TFormData\>

```ts
type RemoveFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, index, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:247](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L247)

Removes an element from an array field.

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

The index to remove, from `0` through `array.length - 1`.

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

Controls metadata updates and whether validation runs.

## Returns

`void`

## Example

```ts
// items: ['first', 'second', 'third']
formApi.removeFieldValue('items', 1)
// items: ['first', 'third']
```
