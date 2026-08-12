---
id: SwapFieldValuesFn
title: SwapFieldValuesFn
---

# Type Alias: SwapFieldValuesFn\<TFormData\>

```ts
type SwapFieldValuesFn<TFormData> = <TFieldName>(arrayFieldName, indexA, indexB, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:97](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L97)

Swaps two elements in an array field.

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

### indexA

`number`

The first index to swap, from `0` through `array.length - 1`.

### indexB

`number`

The second index to swap, from `0` through `array.length - 1`.

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

Controls metadata updates and whether validation runs.

## Returns

`void`

## Example

```ts
// items: ['first', 'second', 'third']
formApi.swapFieldValues('items', 0, 2)
// items: ['third', 'second', 'first']
```
