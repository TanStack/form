---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:48](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L48)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
