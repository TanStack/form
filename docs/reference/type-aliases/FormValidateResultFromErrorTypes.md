---
id: FormValidateResultFromErrorTypes
title: FormValidateResultFromErrorTypes
---

# Type Alias: FormValidateResultFromErrorTypes\<TFormData, TFormErrorTypes\>

```ts
type FormValidateResultFromErrorTypes<TFormData, TFormErrorTypes> = 
  | ValidValidationResult
  | ValidationErrorInputFromType<TFormErrorTypes["formError"]>
  | {
  fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInputFromType<TFormErrorTypes["fieldError"]>>>;
  form?: ValidationErrorInputFromType<TFormErrorTypes["formError"]>;
};
```

Defined in: [validation.public.ts:617](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L617)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)
