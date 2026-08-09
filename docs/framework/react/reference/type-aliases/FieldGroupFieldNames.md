---
id: FieldGroupFieldNames
title: FieldGroupFieldNames
---

# Type Alias: FieldGroupFieldNames\<TFieldData, TFields\>

```ts
type FieldGroupFieldNames<TFieldData, TFields> = { [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<TFieldData, TFields[TFieldName]> };
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:76](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L76)

## Type Parameters

### TFieldData

`TFieldData`

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
