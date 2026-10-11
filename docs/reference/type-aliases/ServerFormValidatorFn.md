---
id: ServerFormValidatorFn
title: ServerFormValidatorFn
---

```ts
type ServerFormValidatorFn<TFormData> = ValidatorFn<ServerFormValidatorContext<TFormData>, FormValidateResult<TFormData>>;
```

Defined in: [validation.public.ts:806](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L806)

Validates submitted form values on the server without a client form instance.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
