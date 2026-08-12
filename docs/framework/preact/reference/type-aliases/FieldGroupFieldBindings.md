---
id: FieldGroupFieldBindings
title: FieldGroupFieldBindings
---

# Type Alias: FieldGroupFieldBindings\<TFields, TFormData\>

```ts
type FieldGroupFieldBindings<TFields, TFormData> = { [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<TFormData, TFields[TFieldName]> };
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:131](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L131)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

### TFormData

`TFormData` = `any`
