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

Defined in: [packages/form-core/src/validation.public.ts:625](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L625)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)
