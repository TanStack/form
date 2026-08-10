---
id: FieldGroupFieldBindingForSlot
title: FieldGroupFieldBindingForSlot
---

# Type Alias: FieldGroupFieldBindingForSlot\<TFormData, TSlot\>

```ts
type FieldGroupFieldBindingForSlot<TFormData, TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode> ? TMode extends "strict" ? FieldGroupFieldNameForSlot<TFormData, TSlot> : DeepKeysWhereValueIncludes<TFormData, TValue> : never;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:104](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L104)

## Type Parameters

### TFormData

`TFormData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
