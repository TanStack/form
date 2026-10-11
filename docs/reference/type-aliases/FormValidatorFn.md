---
id: FormValidatorFn
title: FormValidatorFn
---

```ts
type FormValidatorFn<TFormData> = ValidatorFn<FormValidatorContext<TFormData>, FormValidateResult<TFormData>>;
```

Defined in: [validation.public.ts:796](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L796)

Validates complete form values and can return form errors, field errors, or output data.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
