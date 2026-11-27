---
id: FormGroupOnSubmitInvalidFn
title: FormGroupOnSubmitInvalidFn
---

```ts
type FormGroupOnSubmitInvalidFn<TFormData, TGroupName, TGroupValue, TGroupError, TFormError> = (context) => Awaitable<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L187)

Handles validation failures and exceptions during a form group submission.

Runs for errors reported by field or form group validators, validation errors
returned from `onSubmit` using its error helpers, and exceptions thrown or
rejected during either stage. A returned promise is awaited before
`handleSubmit()` settles.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TGroupName

`TGroupName`

Library-managed. Do not specify explicitly.

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Parameters

### context

[`FormGroupSubmitInvalidContext`](../interfaces/FormGroupSubmitInvalidContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupError`, `TFormError`\>

## Returns

[`Awaitable`](Awaitable.md)\<`void`\>

## Remarks

**Important:** Setting this callback does not suppress exceptions.
Call `preventThrow()` to prevent the submission's exception from rejecting
`handleSubmit()`. Exceptions caused in this callback are not caught.

## Example

```ts
{
  // ...
  onSubmitInvalid: ({ preventThrow }) => {
    preventThrow()
    // Focus the first element marked as invalid.
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  },
}
```
