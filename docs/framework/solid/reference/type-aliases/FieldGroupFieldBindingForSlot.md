---
id: FieldGroupFieldBindingForSlot
title: FieldGroupFieldBindingForSlot
---

# Type Alias: FieldGroupFieldBindingForSlot\<TFormData, TSlot\>

```ts
type FieldGroupFieldBindingForSlot<TFormData, TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode> ? TMode extends "strict" ? FieldGroupFieldNameForSlot<TFormData, TSlot> : DeepKeysWhereValueIncludes<TFormData, TValue> : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:109](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L109)

## Type Parameters

### TFormData

`TFormData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
