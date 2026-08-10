---
id: FieldGroupFieldBindings
title: FieldGroupFieldBindings
---

# Type Alias: FieldGroupFieldBindings\<TFields, TFormData\>

```ts
type FieldGroupFieldBindings<TFields, TFormData> = { [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<TFormData, TFields[TFieldName]> };
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:130](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L130)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

### TFormData

`TFormData` = `any`
