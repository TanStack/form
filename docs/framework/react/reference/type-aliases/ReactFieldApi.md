---
id: ReactFieldApi
title: ReactFieldApi
---

# Type Alias: ReactFieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type ReactFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:86](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L86)

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

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>
