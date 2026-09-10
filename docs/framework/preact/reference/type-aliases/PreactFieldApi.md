---
id: PreactFieldApi
title: PreactFieldApi
---

# Type Alias: PreactFieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type PreactFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:78](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L78)

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
