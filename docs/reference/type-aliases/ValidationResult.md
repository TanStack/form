---
id: ValidationResult
title: ValidationResult
---

# Type Alias: ValidationResult

```ts
type ValidationResult = 
  | ValidValidationResult
  | ValidationErrorInput;
```

Defined in: [validation.public.ts:310](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L310)

Result of validation - can be null/undefined (valid), a single error, or multiple errors.
