---
id: VueFieldApi
title: VueFieldApi
---

# Type Alias: VueFieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type VueFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:65](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L65)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>
