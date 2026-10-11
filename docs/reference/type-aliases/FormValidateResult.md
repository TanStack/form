---
id: FormValidateResult
title: FormValidateResult
---

```ts
type FormValidateResult<TFormData> = 
  | SuccessfulValidationResult
| FormValidationError<TFormData>;
```

Defined in: [validation.public.ts:778](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L778)

A form validator's success result, output data, or validation errors.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
