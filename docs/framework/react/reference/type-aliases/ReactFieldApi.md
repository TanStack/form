---
id: ReactFieldApi
title: ReactFieldApi
---

# Type Alias: ReactFieldApi\<TFieldName, TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

```ts
type ReactFieldApi<TFieldName, TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormData, TFormValidatorMetas, TSubmitReturn> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:116](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L116)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidatorMetas

`TFieldValidatorMetas` *extends* `FieldValidatorMetas`

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* `FormGroupValidatorMetas`

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>
