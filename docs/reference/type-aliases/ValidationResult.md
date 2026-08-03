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

Defined in: [validation.public.ts:422](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L422)

Result of validation - can be null/undefined (valid), a single error, or multiple errors.
