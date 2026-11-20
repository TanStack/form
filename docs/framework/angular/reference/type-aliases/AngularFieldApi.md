---
id: AngularFieldApi
title: AngularFieldApi
---

```ts
type AngularFieldApi<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormError> = FieldApi<TFieldName, TFieldValue, ToFieldError<TFieldValidators, never, TFormError>, TFormData, TFormError>;
```

Defined in: [tanstack-field.ts:92](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L92)

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName` *extends* `DeepKeys`\<`TFormData`\>

### TFieldValue

`TFieldValue` *extends* `DeepValue`\<`TFormData`, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

### TFormError

`TFormError` *extends* `ScopedErrorTypes`
