---
id: FormValidationFailure
title: FormValidationFailure
---

```ts
type FormValidationFailure<TFormData> = 
  | ValidationFailure
| ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>;
```

Defined in: [validation/results/results.public.ts:77](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L77)

## Type Parameters

### TFormData

`TFormData`
