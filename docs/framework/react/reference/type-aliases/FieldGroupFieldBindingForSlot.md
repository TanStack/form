---
id: FieldGroupFieldBindingForSlot
title: FieldGroupFieldBindingForSlot
---

# Type Alias: FieldGroupFieldBindingForSlot\<TFormData, TSlot\>

```ts
type FieldGroupFieldBindingForSlot<TFormData, TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode> ? TMode extends "strict" ? FieldGroupFieldNameForSlot<TFormData, TSlot> : DeepKeysWhereValueIncludes<TFormData, TValue> : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:120](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L120)

## Type Parameters

### TFormData

`TFormData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
