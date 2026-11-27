---
id: ReactFieldApi
title: ReactFieldApi
---

```ts
type ReactFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:78](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L78)

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

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md)
