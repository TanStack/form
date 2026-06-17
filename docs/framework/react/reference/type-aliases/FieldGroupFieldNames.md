---
id: FieldGroupFieldNames
title: FieldGroupFieldNames
---

# Type Alias: FieldGroupFieldNames\<TFieldData, TFields\>

```ts
type FieldGroupFieldNames<TFieldData, TFields> = { [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<TFieldData, TFields[TFieldName]> };
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:77](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L77)

## Type Parameters

### TFieldData

`TFieldData`

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
