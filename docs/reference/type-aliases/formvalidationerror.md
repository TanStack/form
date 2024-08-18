---
id: FormValidationError
title: FormValidationError
---

# Type Alias: FormValidationError

> `[FormValidationError](../type-aliases/formvalidationerror.md)<TFormData>` is either a [`ValidationError`](../type-aliases/validationerror.md) or an object with the following keys:
> - `form` (optional): A form error
> - `fields`: Field-level errors that should be set in the form validator
>
> Here's an example:
>
> ```tsx
> {
>   form: 'This form contains an error',
>   fields: {
>     age: "Must be 13 or older to register"
>   }
> }
> ```



```ts
type FormValidationError<TFormData> =
  | ValidationError
  | {
      form?: ValidationError
      fields: Partial<Record<DeepKeys<TFormData>, ValidationError>>
    }
```

## Defined in

[packages/form-core/src/types.ts:1](https://github.com/TanStack/form/tree/main/form-core/src/types.ts#L43)
