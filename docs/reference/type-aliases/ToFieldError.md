---
id: ToFieldError
title: ToFieldError
---

# Type Alias: ToFieldError\<TFieldValidators, TGroupFieldError, TFormErrorTypes\>

```ts
type ToFieldError<TFieldValidators, TGroupFieldError, TFormErrorTypes> = 
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? ValidationIssue : TGroupFieldError
| ExtractFormFieldError<TFormErrorTypes>;
```

Defined in: [validation.public.ts:730](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L730)

## Type Parameters

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](FieldValidators.md)\<`any`, `any`, `any`\>

### TGroupFieldError

`TGroupFieldError`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)
