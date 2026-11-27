---
id: FormGroupValidateResult
title: FormGroupValidateResult
---

```ts
type FormGroupValidateResult<TGroupValue> = 
  | SuccessfulValidationResult
| FormGroupValidationError<TGroupValue>;
```

Defined in: [validation/results/results.public.ts:185](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L185)

A form group validator's success result, output data, or validation errors.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.
