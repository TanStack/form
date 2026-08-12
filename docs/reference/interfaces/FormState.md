---
id: FormState
title: FormState
---

# Interface: FormState\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L214)

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

Defined in: [FormApi/FormApi.public.ts:258](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L258)

Whether the form can currently be submitted.

This is an optimistic button affordance: `true` until validation has found
errors, then `false` while errors are known or the form is submitting.

***

### errors

```ts
errors: FormErrors<TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:243](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L243)

Array of form-level validation errors.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [FormApi/FormApi.public.ts:239](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L239)

Whether the current form values are deeply equal to the default values.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [FormApi/FormApi.public.ts:231](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L231)

Whether the form has been dirtied. The opposite of `isPristine`.

TODO add link to persistent dirty model? Or maybe a reference to isDefaultValue?

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:251](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L251)

Whether the form currently has form-level or field-level errors.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [FormApi/FormApi.public.ts:235](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L235)

Whether the form has not yet been dirtied. The opposite of `isDirty`.

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [FormApi/FormApi.public.ts:267](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L267)

Whether the latest submission completed without validation or submit errors.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [FormApi/FormApi.public.ts:263](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L263)

Whether the form is currently in the process of submitting.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [FormApi/FormApi.public.ts:225](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L225)

Whether the form has been touched.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [FormApi/FormApi.public.ts:247](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L247)

Whether the form currently has no form-level or field-level errors.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [FormApi/FormApi.public.ts:271](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L271)

Whether the form, any form group, or any field is currently validating.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormApi/FormApi.public.ts:277](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L277)

The number of times a submission has been attempted, regardless of its success.

If the form is reset, this will revert back to 0.

***

### values

```ts
values: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:221](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L221)

The current values of the form.
