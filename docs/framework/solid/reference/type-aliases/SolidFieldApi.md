---
id: SolidFieldApi
title: SolidFieldApi
---

```ts
type SolidFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError, TFieldComponents> = Accessor<FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError>> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/solid-form/src/Components.public.ts:62](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L62)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldError

`TFieldError`

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
