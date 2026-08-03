---
id: FormState
title: FormState
---

# Interface: FormState\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:226](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L226)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [FormApi/FormApi.public.ts:270](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L270)

Whether the form can currently be submitted.

This is an optimistic button affordance: `true` until validation has found
errors, then `false` while errors are known or the form is submitting.

***

### errors

```ts
errors: FormErrors<TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:255](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L255)

Array of form-level validation errors.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [FormApi/FormApi.public.ts:251](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L251)

Whether the current form values are deeply equal to the default values.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [FormApi/FormApi.public.ts:243](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L243)

Whether the form has been dirtied. The opposite of `isPristine`.

TODO add link to persistent dirty model? Or maybe a reference to isDefaultValue?

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:263](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L263)

Whether the form currently has form-level or field-level errors.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [FormApi/FormApi.public.ts:247](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L247)

Whether the form has not yet been dirtied. The opposite of `isDirty`.

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [FormApi/FormApi.public.ts:279](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L279)

Whether the latest submission completed without validation or submit errors.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [FormApi/FormApi.public.ts:275](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L275)

Whether the form is currently in the process of submitting.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [FormApi/FormApi.public.ts:237](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L237)

Whether the form has been touched.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:259](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L259)

Whether the form currently has no form-level or field-level errors.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [FormApi/FormApi.public.ts:283](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L283)

Whether the form or any field is currently validating.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormApi/FormApi.public.ts:289](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L289)

The number of times a submission has been attempted, regardless of its success.

If the form is reset, this will revert back to 0.

***

### values

```ts
values: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:233](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L233)

The current values of the form.
