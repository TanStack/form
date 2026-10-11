---
id: FormValidateResultFromErrorTypes
title: FormValidateResultFromErrorTypes
---

```ts
type FormValidateResultFromErrorTypes<TFormData, TFormErrorTypes> = 
  | ValidValidationResult
  | ValidationErrorInputFromType<TFormErrorTypes["formError"]>
  | {
  fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInputFromType<TFormErrorTypes["fieldError"]>>>;
  form?: ValidationErrorInputFromType<TFormErrorTypes["formError"]>;
};
```

Defined in: [validation.public.ts:1129](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1129)

Form validation results constrained to inferred issue types, as stored in server form state.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)

Library-managed. Do not specify explicitly.
