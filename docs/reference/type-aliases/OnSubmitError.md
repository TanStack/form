---
id: OnSubmitError
title: OnSubmitError
---

```ts
type OnSubmitError<TFormValidationError> = object;
```

Defined in: [FormApi/FormApi.public.ts:43](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L43)

A validation error wrapped for processing as an `onSubmit` failure.

Create this value with the `createValidationError` or `parseIssues` helper
provided to `onSubmit`, then return it from the callback so its form- and
field-level errors are added to validation state.

## Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, createValidationError }) => {
    const result = await saveUser(value)

    if (!result.ok) {
      return createValidationError(result.error)
    }
  },
})
```

## Type Parameters

### TFormValidationError

`TFormValidationError` *extends* [`FormValidationError`](FormValidationError.md)\<`any`\>

Library-managed. Do not specify explicitly.

## Properties

### \[SUBMIT\_ERROR\]

```ts
readonly [SUBMIT_ERROR]: TFormValidationError;
```

Defined in: [FormApi/FormApi.public.ts:46](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L46)
