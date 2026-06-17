---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:146](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L146)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
