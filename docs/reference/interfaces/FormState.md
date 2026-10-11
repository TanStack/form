---
id: FormState
title: FormState
---

Defined in: [FormApi/FormApi.public.ts:419](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L419)

A snapshot of current values, validation status, and submission metadata.

Read the latest snapshot from `formApi.state` or subscribe to
`formApi.atom`.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [FormApi/FormApi.public.ts:497](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L497)

Whether no submission is running and validation state has no known errors.

This is optimistic: validation does not need to have run, and pending
validation alone does not make it `false`. `handleSubmit()` still runs
submission validation.

* Equivalent to `isValid && !isSubmitting`.

***

### errors

```ts
errors: FormErrors<TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:471](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L471)

Form-level errors from validators and `onSubmit`.

Errors are flattened in validator order, with `onSubmit` errors last.
Errors routed to fields are exposed through the corresponding field APIs
and are not included here.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [FormApi/FormApi.public.ts:463](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L463)

Whether current values deeply match `formApi.defaultValues`.

Unlike `isDirty` and `isPristine`, this compares current values with their
defaults rather than tracking whether edits have occurred. Reverting an
edit can make it `true` while `isDirty` remains `true`.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [FormApi/FormApi.public.ts:444](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L444)

Whether a value update has marked state as dirty.

This records whether a dirty-marking update has occurred, not whether
current values match their defaults. Once `true`, it remains `true` even if
values return to their defaults. `formApi.reset()` clears it.

* Equivalent to `!isPristine`.
* Use `isDefaultValue` to check whether current values match their defaults.

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:487](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L487)

Whether validation state contains at least one form- or field-level error.

This is the exact inverse of `isValid`. Field `errorVisibility` does not
affect it.

* Equivalent to `!isValid`.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [FormApi/FormApi.public.ts:455](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L455)

Whether state has not been marked dirty.

This records whether a dirty-marking update has occurred, not whether
current values match their defaults. Once `false`, it remains `false` even
if values return to their defaults. `formApi.reset()` restores it.

* Equivalent to `!isDirty`.
* Use `isDefaultValue` to check whether current values match their defaults.

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [FormApi/FormApi.public.ts:512](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L512)

Whether the latest completed submission finished without validation errors
or an `onSubmit` failure.

It starts as `false`, updates when an attempt finishes, and is cleared by
`formApi.reset()`.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [FormApi/FormApi.public.ts:504](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L504)

Whether a submission attempt is in progress.

This includes submission validation and the time spent awaiting `onSubmit`
or `onSubmitInvalid`.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [FormApi/FormApi.public.ts:433](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L433)

Whether at least one field is currently touched.

Field changes mark fields as touched by default, and submission marks all
registered fields as touched. Resets clear the touched state.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:478](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L478)

Whether validation state contains no form- or field-level errors.

* Equivalent to `!isInvalid`.
* A field error hidden by `errorVisibility` still makes this `false`.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [FormApi/FormApi.public.ts:519](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L519)

Whether any form-, group-, or field-level validation is pending.

It remains `true` until all concurrent validation work finishes or is
canceled. Pending validation does not by itself make `canSubmit` `false`.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormApi/FormApi.public.ts:526](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L526)

Number of submission attempts started since the last reset.

An attempt is counted before validation begins, whether it succeeds or
fails. `formApi.reset()` returns the count to `0`.

***

### values

```ts
values: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L426)

Current values after field edits, resets, or default-value updates.
