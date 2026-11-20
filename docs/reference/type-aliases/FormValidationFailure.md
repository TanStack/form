---
id: FormValidationFailure
title: FormValidationFailure
---

```ts
type FormValidationFailure<TFormData> = 
  | ValidationFailure
| ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>;
```

Defined in: [validation/state.public.ts:81](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L81)

## Type Parameters

### TFormData

`TFormData`
