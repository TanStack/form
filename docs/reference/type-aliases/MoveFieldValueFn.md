---
id: MoveFieldValueFn
title: MoveFieldValueFn
---

# Type Alias: MoveFieldValueFn()\<TFormData\>

```ts
type MoveFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, fromIndex, toIndex, options?) => void;
```

Defined in: [packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts:41](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L41)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

## Parameters

### arrayFieldName

`TFieldName`

### fromIndex

`number`

### toIndex

`number`

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

## Returns

`void`
