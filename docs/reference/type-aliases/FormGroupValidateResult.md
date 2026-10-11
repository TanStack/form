---
id: FormGroupValidateResult
title: FormGroupValidateResult
---

```ts
type FormGroupValidateResult<TGroupValue> = 
  | SuccessfulValidationResult
| FormGroupValidationError<TGroupValue>;
```

Defined in: [validation.public.ts:900](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L900)

A form group validator's success result, output data, or validation errors.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.
