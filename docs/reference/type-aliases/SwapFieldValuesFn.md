---
id: SwapFieldValuesFn
title: SwapFieldValuesFn
---

# Type Alias: SwapFieldValuesFn()\<TFormData\>

```ts
type SwapFieldValuesFn<TFormData> = <TFieldName>(arrayFieldName, indexA, indexB, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:32](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L32)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

## Parameters

### arrayFieldName

`TFieldName`

### indexA

`number`

### indexB

`number`

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

## Returns

`void`
