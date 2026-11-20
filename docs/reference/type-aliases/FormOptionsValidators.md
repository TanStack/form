---
id: FormOptionsValidators
title: FormOptionsValidators
---

```ts
type FormOptionsValidators<TFormData, TValidatorConfig, TValidators> = { [K in keyof TValidatorConfig]: FormOptionsValidator<TFormData, TValidatorConfig, TValidators, K> };
```

Defined in: [validation/formValidators.public.ts:577](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L577)

Matches each form validator to its own trigger and submission settings so
callback values and events are inferred for that validator.

Validator array positions are preserved.

## Type Parameters

### TFormData

`TFormData`

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

### TValidators

`TValidators` = `unknown`
