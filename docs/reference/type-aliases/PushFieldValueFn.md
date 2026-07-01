---
id: PushFieldValueFn
title: PushFieldValueFn
---

# Type Alias: PushFieldValueFn()\<TFormData\>

```ts
type PushFieldValueFn<TFormData> = <TFieldName>(arrayFieldName, value, options?) => void;
```

Defined in: [packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts:50](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L50)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

## Parameters

### arrayFieldName

`TFieldName`

### value

[`ArrayFieldElement`](ArrayFieldElement.md)\<`TFormData`, `TFieldName`\>

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md)

## Returns

`void`
