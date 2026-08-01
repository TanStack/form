---
id: ServerFormState
title: ServerFormState
---

# Type Alias: ServerFormState\<TFormData, TFormValidators\>

```ts
type ServerFormState<TFormData, TFormValidators> = ServerFormStateByResult<TFormData, ServerFormValidateResult<TFormData, TFormValidators>>;
```

Defined in: [packages/form-core/src/ssr.public.ts:40](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L40)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>
