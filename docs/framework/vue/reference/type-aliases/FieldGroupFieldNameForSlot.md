---
id: FieldGroupFieldNameForSlot
title: FieldGroupFieldNameForSlot
---

# Type Alias: FieldGroupFieldNameForSlot\<TFieldData, TSlot\>

```ts
type FieldGroupFieldNameForSlot<TFieldData, TSlot> = { [TFieldName in DeepKeys<TFieldData>]: FieldGroupFieldSlotAllows<TSlot, DeepValue<TFieldData, TFieldName>> extends true ? TFieldName : never }[DeepKeys<TFieldData>];
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:57](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L57)

## Type Parameters

### TFieldData

`TFieldData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
