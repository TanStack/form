---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TFieldGroup, TFormData\>

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [with-fields.ts:122](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L122)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
