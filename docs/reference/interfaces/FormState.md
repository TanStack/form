---
id: FormState
title: FormState
---

Defined in: [FormApi/FormApi.public.ts:25](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L25)

Current form values, validation status, and submission metadata.

Read the state through `formApi.state`, or subscribe to `formApi.atom` to
observe changes.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [FormApi/FormApi.public.ts:97](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L97)

Whether the form has no stored validation errors and no submission is in
progress. Equivalent to `isValid && !isSubmitting`.

- Defaults to `true`, even when no values have changed. Check `isPristine` separately if submission requires edited values.
- Pending validation alone does not make this `false`. Use `isValidating` for that instead.

#### Remarks

**Important:** `formApi.handleSubmit()` remains callable when this is `false`.
Submission runs all field and form validators by default unless they set `skipOnSubmit`.

***

### errors

```ts
errors: FormError<TFormError>[];
```

Defined in: [FormApi/FormApi.public.ts:70](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L70)

Form-level validation issues from form validators and `onSubmit`.

- Issues are flattened in validator order, with `onSubmit` issues last.
- Field and form group errors are exposed through their APIs and excluded
  from this array.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [FormApi/FormApi.public.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L62)

Whether current values deeply equal `formApi.defaultValues`.

Returning values to their defaults makes this `true` even when `isDirty`
remains `true`.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [FormApi/FormApi.public.ts:49](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L49)

Whether a value update has marked the form dirty.

- Field changes mark the form dirty by default.
- Returning values to their defaults leaves this `true`.
- Resetting the form clears this flag.
- Use `isDefaultValue` to compare current values with their defaults.

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:85](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L85)

Whether the form, a field, or a form group has a stored validation error.
Equivalent to `!isValid`.

Field `errorVisibility` does not affect this flag.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [FormApi/FormApi.public.ts:55](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L55)

Whether the form has not been marked dirty. Equivalent to `!isDirty`.

Use `isDefaultValue` to compare current values with their defaults.

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [FormApi/FormApi.public.ts:115](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L115)

Whether the last completed form submission succeeded.

Success requires validation to pass and `onSubmit` to finish without
validation errors or exceptions.

- The previous result remains while a new attempt runs.
- Superseded or canceled attempts cannot update this flag.
- The flag starts as `false`. Resetting or unmounting the form clears it.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [FormApi/FormApi.public.ts:104](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L104)

Whether a form submission is in progress.

This includes validation and waiting for `onSubmit` or `onSubmitInvalid`
to finish.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [FormApi/FormApi.public.ts:40](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L40)

Whether at least one field is touched.

- Field changes and blurs mark fields touched by default.
- Attempting to submit the form touches all fields.
- Resetting the form clears touched state.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:78](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L78)

Whether the form, its fields, and its form groups have no stored validation
errors. Equivalent to `!isInvalid`.

- Validation does not need to have run for this to be `true`.
- Field `errorVisibility` does not affect this flag.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [FormApi/FormApi.public.ts:122](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L122)

Whether any form, form group, or field validation is pending.

This remains `true` until all pending validation finishes or is canceled.
Pending validation alone does not make `canSubmit` `false`.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormApi/FormApi.public.ts:131](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L131)

Number of form submission attempts recorded, including failed or canceled
attempts.

- Each `handleSubmit()` call increments the count before validation.
- `formApi.reset()` sets the count to `0`.
- Form group submissions do not increment this count.

***

### values

```ts
values: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:32](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L32)

The current values of the form.
