---
id: FieldGroupFieldNames
title: FieldGroupFieldNames
---

# Type Alias: FieldGroupFieldNames\<TFieldData, TFields\>

```ts
type FieldGroupFieldNames<TFieldData, TFields> = { [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<TFieldData, TFields[TFieldName]> };
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:132](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L132)

Maps each virtual field name to the compatible deep paths in field data.

## Type Parameters

### TFieldData

`TFieldData`

The parent form data whose field paths are searched.

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

The virtual field schema whose slots constrain each
path.
