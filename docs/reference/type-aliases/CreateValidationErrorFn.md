---
id: CreateValidationErrorFn
title: CreateValidationErrorFn
---

# Type Alias: CreateValidationErrorFn()\<TFormData\>

```ts
type CreateValidationErrorFn<TFormData> = <TError>(error) => OnSubmitError<TError>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:29](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L29)

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
