---
id: ClearFieldValuesFn
title: ClearFieldValuesFn
---

# Type Alias: ClearFieldValuesFn\<TFormData\>

```ts
type ClearFieldValuesFn<TFormData> = <TFieldName>(arrayFieldName, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:218](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L218)

Removes every element from an array field.

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

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

Controls metadata updates and whether validation runs.

## Returns

`void`

## Example

```ts
// items: ['first', 'second']
formApi.clearFieldValues('items')
// items: []
```
