---
id: SolidFieldApi
title: SolidFieldApi
---

# Type Alias: SolidFieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type SolidFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes, TFieldComponents> = Accessor<FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/solid-form/src/Components.public.ts:62](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L62)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
