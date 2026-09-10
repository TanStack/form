---
id: FieldGroupFieldBindingForSlot
title: FieldGroupFieldBindingForSlot
---

# Type Alias: FieldGroupFieldBindingForSlot\<TFormData, TSlot\>

```ts
type FieldGroupFieldBindingForSlot<TFormData, TSlot> = FieldGroupFieldNameForSlot<TFormData, TSlot>;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:163](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L163)

Produces the concrete form paths that can bind to one virtual field slot.

## Type Parameters

### TFormData

`TFormData`

The parent form data whose field paths are searched.

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)

The virtual field slot that each path must satisfy.
