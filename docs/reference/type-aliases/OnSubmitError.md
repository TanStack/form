---
id: OnSubmitError
title: OnSubmitError
---

# Type Alias: OnSubmitError\<TFormValidationError\>

```ts
type OnSubmitError<TFormValidationError> = TFormValidationError & object;
```

Defined in: [FormApi/FormApi.public.ts:44](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L44)

A validation error marked for processing as an `onSubmit` failure.

Create this value with the `createValidationError` or `parseIssues` helper
provided to `onSubmit`, then return it from the callback so its form- and
field-level errors are added to validation state.

## Type Declaration

### \[onSubmitErrorBrand\]

```ts
[onSubmitErrorBrand]: true;
```

Internal brand used to identify submit errors. Do not access directly.

## Type Parameters

### TFormValidationError

`TFormValidationError` *extends* [`FormValidationError`](FormValidationError.md)\<`any`\>

Library-managed. Do not specify explicitly.

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
