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

Defined in: [packages/form-core/src/validation.public.ts:402](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L402)

Result of validation - can be null/undefined (valid), a single error, or multiple errors.
