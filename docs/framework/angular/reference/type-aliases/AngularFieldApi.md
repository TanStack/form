---
id: AngularFieldApi
title: AngularFieldApi
---

# Type Alias: AngularFieldApi\<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormValidators, TSubmitReturn\>

```ts
type AngularFieldApi<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormValidators, TSubmitReturn> = FieldApi<TFieldName, TFieldValue, ToFieldError<TFieldValidators, never, ToFormErrorTypes<TFormValidators, TSubmitReturn>>, TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>>;
```

Defined in: [tanstack-field.ts:96](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L96)

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName` *extends* `DeepKeys`\<`TFormData`\>

### TFieldValue

`TFieldValue` *extends* `DeepValue`\<`TFormData`, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`
