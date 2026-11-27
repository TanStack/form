---
id: FormattedValidationResult
title: FormattedValidationResult
---

```ts
type FormattedValidationResult<TFormData> = 
  | ValidationIssue[]
  | FormattedValidationErrorMap<TFormData>
  | ValidationSuccess;
```

Defined in: [validation/results/results.public.ts:110](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L110)

A validator result with formatted error contents. Successful results retain
their original value; ordinary errors are arrays of issue objects.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
