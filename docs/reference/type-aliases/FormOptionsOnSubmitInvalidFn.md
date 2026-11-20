---
id: FormOptionsOnSubmitInvalidFn
title: FormOptionsOnSubmitInvalidFn
---

```ts
type FormOptionsOnSubmitInvalidFn<TFormData, TFormError> = (context) => Awaitable<void>;
```

Defined in: [FormApi/formSubmit.public.ts:225](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L225)

Handles a failed form submission.

Runs for submission validation failures, errors returned from `onSubmit`, and
exceptions thrown during validation or `onSubmit`.

A returned promise is awaited before submission finishes. If this callback
throws or rejects, `handleSubmit()` rejects.

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
