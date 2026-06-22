---
id: FormErrors
title: FormErrors
---

# Type Alias: FormErrors\<TFormValidatorMetas, TSubmitReturn\>

```ts
type FormErrors<TFormValidatorMetas, TSubmitReturn> = (
  | IfBroad<FormValidatorMetas, TFormValidatorMetas, ValidationIssue, TFormValidatorMetas[number]["formError"]>
  | ExtractSubmitFormError<TSubmitReturn>)[];
```

Defined in: [validation.public.ts:499](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L499)

## Type Parameters

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`
