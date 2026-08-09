---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:126](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L126)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
