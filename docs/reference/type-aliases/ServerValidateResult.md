---
id: ServerValidateResult
title: ServerValidateResult
---

# Type Alias: ServerValidateResult\<TFormData, TFormValidators\>

```ts
type ServerValidateResult<TFormData, TFormValidators> = 
  | ServerValidateSuccess<TFormData, TFormValidators>
| ServerValidateFailure<TFormData, TFormValidators>;
```

Defined in: [ssr.public.ts:73](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/ssr.public.ts#L73)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>
