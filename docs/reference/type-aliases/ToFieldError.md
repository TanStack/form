---
id: ToFieldError
title: ToFieldError
---

```ts
type ToFieldError<TFieldValidators, TGroupFieldError, TFormError> = FallbackToValidationIssue<
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? never : TGroupFieldError
| ExtractFormFieldError<TFormError>>;
```

Defined in: [validation.public.ts:975](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L975)

Combines a field's own issue types with errors routed from its group and form.

Falls back to `ValidationIssue` when no specific error type is inferred.

## Type Parameters

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](FieldValidators.md)\<`any`, `any`, `any`\>

Library-managed. Do not specify explicitly.

### TGroupFieldError

`TGroupFieldError`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.
