---
id: ServerValidateResult
title: ServerValidateResult
---

```ts
type ServerValidateResult<TFormData, TValidators> = 
  | ServerValidateSuccess<TFormData, TValidators>
| ServerValidateFailure<TFormData>;
```

Defined in: [FormApi/formServerState.public.ts:64](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L64)

## Type Parameters

### TFormData

`TFormData`

### TValidators

`TValidators`
