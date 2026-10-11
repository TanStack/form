---
id: FormValidationError
title: FormValidationError
---

```ts
type FormValidationError<TFormData> = 
  | ValidationErrorInput
| ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:771](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L771)

Errors for a form, optionally including errors routed to individual fields.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
