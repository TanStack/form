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

Defined in: [packages/form-core/src/ssr.public.ts:53](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L53)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>
