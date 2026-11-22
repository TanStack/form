---
id: BaseSubmitContext
title: BaseSubmitContext
---

Defined in: [FormApi/formSubmit.public.ts:103](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L103)

Provides the cancellation signal and error helpers for form and form group
`onSubmit` callbacks.

## Extended by

- [`FormSubmitContext`](FormSubmitContext.md)
- [`FormGroupSubmitContext`](FormGroupSubmitContext.md)

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### createErrorMap

```ts
createErrorMap: CreateSubmitErrorMapFn<TFormData>;
```

Defined in: [FormApi/formSubmit.public.ts:172](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L172)

Builds a mutable map of submission errors from optional initial errors.

- If you already have errors ready to return, use
  [createValidationError](#createvalidationerror).
- If you want to return Standard Schema errors, use
  [parseIssues](#parseissues).
- Add errors with `addFormError` and `addFieldError`.
- Return the map from `onSubmit` to report its errors.
- The `form` entry targets the submitting form or group.
- Field paths are relative to the submitting form or group.
- An empty map indicates success.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, createErrorMap }) => {
    const errors = createErrorMap()
    if (await nameIsTaken(value.name)) {
      errors.addFieldError('name', 'Name is already taken')
    }
    return errors
  },
})
```

***

### createValidationError

```ts
createValidationError: CreateValidationErrorFn<TFormData>;
```

Defined in: [FormApi/formSubmit.public.ts:144](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L144)

Wraps existing errors so `onSubmit` can return them as validation errors.
Calling this helper alone does not update validation state.

Accepts error messages, issue objects, arrays of errors, or an error map.
For a group, field paths in an error map are relative to the group.

- If you want to build or edit errors by field, use
  [createErrorMap](#createerrormap).
- If you want to return Standard Schema errors, use
  [parseIssues](#parseissues).

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, createValidationError }) => {
    if (await nameIsTaken(value.name)) {
      return createValidationError('Name is already taken')
    }
    await saveProfile(value)
  },
})
```

***

### parseIssues

```ts
parseIssues: ParseSubmitIssuesFn<TFormData>;
```

Defined in: [FormApi/formSubmit.public.ts:200](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L200)

Converts Standard Schema issues into a mutable error map to return from
`onSubmit`.

- If you want to return your own error messages or an existing error map, use
  [createValidationError](#createvalidationerror).
- If you want to build or edit errors by field, use
  [createErrorMap](#createerrormap).
- Uses the captured submission values to resolve field paths.
- Issues without a field path become form or group errors.
- For a group, issue paths are relative to the group.
- Return the map to report its errors. An empty map indicates success.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, parseIssues }) => {
    const result = parseSchema(mySchema, value)
    if (!result.success) {
      return parseIssues(result.issues)
    }
    await saveProfile(result.data)
  },
})
```

***

### signal

```ts
signal: AbortSignal;
```

Defined in: [FormApi/formSubmit.public.ts:118](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L118)

Signals when this submission attempt is invalidated.

- A newer submission of the same form or group aborts the signal.
- A reset or unmount also aborts it.
- Field edits during a submission do not abort the signal.
- The same signal is passed to this attempt's `onSubmitInvalid`, if it runs.

#### Remarks

**Important:** Aborting prevents submission results from updating form or
group state. Callbacks already started are still awaited, and their
exceptions retain normal handling. Use the signal to stop external work
that supports cancellation.
