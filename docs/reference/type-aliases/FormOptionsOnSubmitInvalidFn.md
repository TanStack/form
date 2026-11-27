---
id: FormOptionsOnSubmitInvalidFn
title: FormOptionsOnSubmitInvalidFn
---

```ts
type FormOptionsOnSubmitInvalidFn<TFormData, TFormError> = (context) => Awaitable<void>;
```

Defined in: [FormApi/formSubmit.public.ts:400](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L400)

Handles validation failures and exceptions during a form submission.

Runs for errors reported by field or form validators, validation errors
returned from `onSubmit` using its error helpers, and exceptions thrown or
rejected during either stage. A returned promise is awaited before
`handleSubmit()` settles.

If `onSubmit` fails after cancellation, this callback still runs with the
attempt's captured values and aborted signal.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Parameters

### context

[`FormSubmitInvalidContext`](../interfaces/FormSubmitInvalidContext.md)\<`TFormData`, `TFormError`\>

## Returns

[`Awaitable`](Awaitable.md)\<`void`\>

## Remarks

**Important:** Setting this callback does not suppress exceptions.
Call `preventThrow()` to prevent the submission's exception from rejecting
`handleSubmit()`. Exceptions caused in this callback are not caught.

## Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value }) => {
    await saveProfile(value)
  },
  onSubmitInvalid: async ({ reason, error, preventThrow }) => {
    if (reason === 'exception') {
      // Show an error toast
      await reportSubmissionError(error)
      preventThrow()
    }
  },
})

 formOptions({
  defaultValues: { name: '' },
  onSubmitInvalid: ({ preventThrow }) => {
    preventThrow()
    // Focus the first element marked as invalid.
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  },
})
```
