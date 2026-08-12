---
id: FieldGroupFieldNames
title: FieldGroupFieldNames
---

# Type Alias: FieldGroupFieldNames\<TFieldData, TFields\>

```ts
type FieldGroupFieldNames<TFieldData, TFields> = { [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<TFieldData, TFields[TFieldName]> };
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:65](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L65)

## Type Parameters

### TFieldData

`TFieldData`

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
