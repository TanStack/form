---
id: HandleSubmitFn
title: HandleSubmitFn
---

```ts
type HandleSubmitFn<TFormData> = () => Promise<FormValidationFailure<TFormData>[]>;
```

Defined in: [FormApi/FormApi.public.ts:205](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L205)

Runs submission validation and submits current values when validation
succeeds.

Registered fields are marked touched, field validators run before form
validators, and `onSubmit` is awaited only when validation succeeds.
Validation error results and errors returned by `onSubmit` through
`createValidationError` or `createErrorMap` are stored as error state.
`onSubmitInvalid` is awaited after a failed attempt.

Calls made while an attempt is in progress return the same promise instead
of starting another attempt.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Returns

`Promise`\<[`FormValidationFailure`](FormValidationFailure.md)\<`TFormData`\>[]\>

A promise resolving to the error results produced by field and
form validation, plus any validation error returned by `onSubmit` through
`createValidationError` or `createErrorMap`. The array is empty if none are
produced.
