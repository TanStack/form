---
id: ToFieldError
title: ToFieldError
---

```ts
type ToFieldError<TFieldValidators, TGroupFieldError, TFormErrorTypes> = FallbackToValidationIssue<
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? never : TGroupFieldError
| ExtractFormFieldError<TFormErrorTypes>>;
```

Defined in: [validation.public.ts:1340](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1340)

Combines a field's own issue types with errors routed from its group and form.

Falls back to `ValidationIssue` when no specific error type is inferred.

## Type Parameters

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](FieldValidators.md)\<`any`, `any`, `any`\>

Library-managed. Do not specify explicitly.

### TGroupFieldError

`TGroupFieldError`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)

Library-managed. Do not specify explicitly.
