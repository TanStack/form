---
id: ToFieldError
title: ToFieldError
---

```ts
type ToFieldError<TFieldValidators, TGroupError, TFormError> = FallbackToValidationIssue<
  | ExtractValidatorSelfError<TFieldValidators, FieldValidators<any, any, any>>
  | ExtractSubfieldError<TGroupError>
| ExtractSubfieldError<TFormError>>;
```

Defined in: [validation/state.public.ts:281](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L281)

Combines a field's own issue types with errors routed from its group and form.

Falls back to `ValidationIssue` when no specific error type is inferred.

## Type Parameters

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](FieldValidators.md)\<`any`, `any`, `any`\>

Library-managed. Do not specify explicitly.

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.
