---
id: CreateValidationErrorFn
title: CreateValidationErrorFn
---

```ts
type CreateValidationErrorFn<TFormData> = <TError>(error) => OnSubmitError<TError>;
```

Defined in: [FormApi/FormApi.public.ts:59](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L59)

Wraps a validation error for processing as an `onSubmit` failure without mutating it.

Return the result from `onSubmit` to add its form- and field-level errors to
validation state.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Type Parameters

### TError

`TError` *extends* [`FormValidationError`](FormValidationError.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

## Parameters

### error

`TError`

The form- or field-level validation error to wrap.

## Returns

[`OnSubmitError`](OnSubmitError.md)\<`TError`\>
