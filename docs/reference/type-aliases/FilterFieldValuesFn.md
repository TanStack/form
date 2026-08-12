---
id: FilterFieldValuesFn
title: FilterFieldValuesFn
---

# Type Alias: FilterFieldValuesFn\<TFormData\>

```ts
type FilterFieldValuesFn<TFormData> = <TFieldName>(arrayFieldName, predicate, options?) => void;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:82](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L82)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TFieldName

`TFieldName` *extends* [`ArrayFieldName`](ArrayFieldName.md)\<`TFormData`\>

## Parameters

### arrayFieldName

`TFieldName`

### predicate

[`ArrayFieldPredicate`](ArrayFieldPredicate.md)\<`TFormData`, `TFieldName`\>

### options?

[`FieldUpdateOptions`](../interfaces/FieldUpdateOptions.md) & `object`

## Returns

`void`
