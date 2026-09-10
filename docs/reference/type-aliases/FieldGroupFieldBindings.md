---
id: FieldGroupFieldBindings
title: FieldGroupFieldBindings
---

# Type Alias: FieldGroupFieldBindings\<TFields, TFormData\>

```ts
type FieldGroupFieldBindings<TFields, TFormData> = { [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<TFormData, TFields[TFieldName]> };
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L179)

Maps every virtual field name to the compatible concrete paths in a parent
form.

A supplied binding map is complete: every virtual field in `TFields` must be
assigned a compatible path from `TFormData`.

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

The virtual field schema whose keys become binding
keys.

### TFormData

`TFormData` = `any`

The parent form data whose paths can be bound.
