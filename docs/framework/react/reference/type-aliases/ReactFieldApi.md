---
id: ReactFieldApi
title: ReactFieldApi
---

# Type Alias: ReactFieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type ReactFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:82](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L82)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldError

`TFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md)
