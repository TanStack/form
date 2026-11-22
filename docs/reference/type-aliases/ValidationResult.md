---
id: ValidationResult
title: ValidationResult
---

```ts
type ValidationResult = 
  | ValidValidationResult
  | ValidationErrorInput;
```

Defined in: [validation/results/results.public.ts:170](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L170)

One or more validation errors, or `null`, `undefined`, or `false` for success.
