---
id: CreatedSubmitErrorMap
title: CreatedSubmitErrorMap
---

```ts
type CreatedSubmitErrorMap<TFormData, TFormError, TFieldError> = Required<ValidationErrorMap<TFormData, TFormError, TFieldError>> & OnSubmitError<Required<ValidationErrorMap<TFormData, TFormError, TFieldError>>>;
```

Defined in: [FormApi/formSubmit.public.ts:74](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L74)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* [`ValidationFailure`](ValidationFailure.md)

### TFieldError

`TFieldError` *extends* [`ValidationFailure`](ValidationFailure.md)
