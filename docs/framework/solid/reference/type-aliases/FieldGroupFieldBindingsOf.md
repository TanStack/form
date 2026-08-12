---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:127](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L127)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
