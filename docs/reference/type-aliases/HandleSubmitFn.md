---
id: HandleSubmitFn
title: HandleSubmitFn
---

```ts
type HandleSubmitFn<TFormData> = () => Promise<FormattedValidationError<TFormData>[]>;
```

Defined in: [FormApi/FormApi.public.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L187)

Validates the form and calls `onSubmit` when validation succeeds.

- A submission attempt touches all fields.
- Runs field validators before form validators.
- Awaits `onSubmit` or, after a failed attempt, `onSubmitInvalid`.
- Each call starts a separate attempt and supersedes the form's pending attempt.
  Later edits do not cancel the attempt or replace its captured values.
- Exceptions from validation or `onSubmit` reject the promise unless
  `onSubmitInvalid` calls `preventThrow()`.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Returns

`Promise`\<[`FormattedValidationError`](FormattedValidationError.md)\<`TFormData`\>[]\>

A promise resolving to a flat array of issues and error maps from
field and form validation, plus validation errors returned by `onSubmit`.
Strings become issue objects. The array is empty if no errors are produced.

## Remarks

**Important:** An empty error array does not guarantee a successful submission.
Supersession, reset, unmount, or server-state replacement aborts the attempt's
signal and pending validation. Cancellation before callbacks start resolves
with `[]`. Callbacks that already started are still awaited, but their results
cannot update form state after cancellation.
