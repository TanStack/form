---
id: RemoveFieldValueFn
title: RemoveFieldValueFn
---

# Type Alias: RemoveFieldValueFn()\<TFormData\>

```ts
type RemoveFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, index, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:74](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L74)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

## Parameters

### arrayFieldName

`TFieldName`

### index

`number`

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

## Returns

`void`
