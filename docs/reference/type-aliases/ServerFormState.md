---
id: ServerFormState
title: ServerFormState
---

# Type Alias: ServerFormState\<TFormData, TFormValidators\>

```ts
type ServerFormState<TFormData, TFormValidators> = ServerFormStateByResult<TFormData, FormValidateResultFromErrorTypes<TFormData, ToServerFormErrorTypes<TFormValidators>>>;
```

Defined in: [ssr.public.ts:45](https://github.com/TanStack/form/blob/main/packages/form-core/src/ssr.public.ts#L45)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>
