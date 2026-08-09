---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:145](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L145)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
