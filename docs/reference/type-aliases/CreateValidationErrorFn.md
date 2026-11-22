---
id: CreateValidationErrorFn
title: CreateValidationErrorFn
---

```ts
type CreateValidationErrorFn<TFormData> = <TError>(error) => OnSubmitError<TError>;
```

Defined in: [FormApi/formSubmit.public.ts:64](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L64)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TError

`TError` *extends* [`FormValidationFailure`](FormValidationFailure.md)\<`TFormData`\>

## Parameters

### error

`TError`

## Returns

[`OnSubmitError`](OnSubmitError.md)\<`TError`\>
