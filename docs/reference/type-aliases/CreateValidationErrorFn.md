---
id: CreateValidationErrorFn
title: CreateValidationErrorFn
---

# Type Alias: CreateValidationErrorFn\<TFormData\>

```ts
type CreateValidationErrorFn<TFormData> = <TError>(error) => OnSubmitError<TError>;
```

Defined in: [FormApi/FormApi.public.ts:61](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L61)

Marks a validation error for processing as an `onSubmit` failure.

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

The form- or field-level validation error to mark.

## Returns

[`OnSubmitError`](OnSubmitError.md)\<`TError`\>
