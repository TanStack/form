---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

```ts
type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> = FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData> : never;
```

Defined in: [with-fields.ts:55](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L55)

## Type Parameters

### TFieldGroup

`TFieldGroup`

### TFormData

`TFormData`
