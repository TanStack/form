---
id: FieldGroupFieldNameForSlot
title: FieldGroupFieldNameForSlot
---

# Type Alias: FieldGroupFieldNameForSlot\<TFieldData, TSlot\>

```ts
type FieldGroupFieldNameForSlot<TFieldData, TSlot> = { [TFieldName in DeepKeys<TFieldData>]: FieldGroupFieldSlotAllows<TSlot, DeepValue<TFieldData, TFieldName>> extends true ? TFieldName : never }[DeepKeys<TFieldData>];
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:58](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L58)

## Type Parameters

### TFieldData

`TFieldData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
