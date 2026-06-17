---
id: FieldErrors
title: FieldErrors
---

# Type Alias: FieldErrors\<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

```ts
type FieldErrors<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn> = (
  | IfBroad<FieldValidatorMetas, TFieldValidatorMetas, ValidationIssue, TFieldValidatorMetas[number]["fieldError"]>
  | IfBroad<FormGroupValidatorMetas, TGroupValidatorMetas, ValidationIssue, TGroupValidatorMetas[number]["fieldError"]>
  | IfBroad<FormValidatorMetas, TFormValidatorMetas, ValidationIssue, TFormValidatorMetas[number]["fieldError"]>
  | ExtractSubmitFieldError<TSubmitReturn>)[];
```

Defined in: [validation.public.ts:511](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L511)

## Type Parameters

### TFieldValidatorMetas

`TFieldValidatorMetas` *extends* [`FieldValidatorMetas`](FieldValidatorMetas.md)

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* [`FormGroupValidatorMetas`](FormGroupValidatorMetas.md)

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`
