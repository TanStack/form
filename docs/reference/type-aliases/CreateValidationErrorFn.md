---
id: CreateValidationErrorFn
title: CreateValidationErrorFn
---

# Type Alias: CreateValidationErrorFn\<TFormData\>

```ts
type CreateValidationErrorFn<TFormData> = <TError>(error) => OnSubmitError<TError>;
```

Defined in: [FormApi/FormApi.public.ts:27](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L27)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TError

`TError` *extends* [`FormValidationError`](FormValidationError.md)\<`TFormData`\>

## Parameters

### error

`TError`

## Returns

[`OnSubmitError`](OnSubmitError.md)\<`TError`\>
