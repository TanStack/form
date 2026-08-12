---
id: ReactFieldApi
title: ReactFieldApi
---

# Type Alias: ReactFieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type ReactFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:84](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L84)

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
