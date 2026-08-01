---
id: ServerFormValidateResult
title: ServerFormValidateResult
---

# Type Alias: ServerFormValidateResult\<TFormData, TFormValidators\>

```ts
type ServerFormValidateResult<TFormData, TFormValidators> = FormValidateResultFromErrorTypes<TFormData, ToServerFormErrorTypes<TFormValidators>>;
```

Defined in: [packages/form-core/src/ssr.public.ts:16](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L16)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>
