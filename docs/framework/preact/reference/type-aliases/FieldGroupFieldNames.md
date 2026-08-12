---
id: FieldGroupFieldNames
title: FieldGroupFieldNames
---

# Type Alias: FieldGroupFieldNames\<TFieldData, TFields\>

```ts
type FieldGroupFieldNames<TFieldData, TFields> = { [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<TFieldData, TFields[TFieldName]> };
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:73](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L73)

## Type Parameters

### TFieldData

`TFieldData`

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
