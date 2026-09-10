---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:44](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L44)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
