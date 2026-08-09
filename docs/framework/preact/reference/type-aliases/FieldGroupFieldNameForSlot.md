---
id: FieldGroupFieldNameForSlot
title: FieldGroupFieldNameForSlot
---

# Type Alias: FieldGroupFieldNameForSlot\<TFieldData, TSlot\>

```ts
type FieldGroupFieldNameForSlot<TFieldData, TSlot> = { [TFieldName in DeepKeys<TFieldData>]: FieldGroupFieldSlotAllows<TSlot, DeepValue<TFieldData, TFieldName>> extends true ? TFieldName : never }[DeepKeys<TFieldData>];
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:63](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L63)

## Type Parameters

### TFieldData

`TFieldData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
