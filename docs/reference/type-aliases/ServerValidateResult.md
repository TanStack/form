---
id: ServerValidateResult
title: ServerValidateResult
---

```ts
type ServerValidateResult<TFormData, TFormValidators> = 
  | ServerValidateSuccess<TFormData, TFormValidators>
| ServerValidateFailure<TFormData, TFormValidators>;
```

Defined in: [ssr.public.ts:78](https://github.com/TanStack/form/blob/main/packages/form-core/src/ssr.public.ts#L78)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>
