---
id: FormState
title: FormState
---

# Interface: FormState\<TFormData, TFormValidatorMetas, TSubmitMeta\>

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:98](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L98)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitMeta

`TSubmitMeta`

## Properties

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:143](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L143)

Whether the form can currently be submitted.

This is an optimistic button affordance: `true` until validation has found
errors, then `false` while errors are known or the form is submitting.

***

### errors

```ts
errors: FormErrors<TFormValidatorMetas, TSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:128](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L128)

Array of form-level validation errors.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:124](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L124)

Whether the current form values are deeply equal to the default values.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:116](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L116)

Whether the form has been dirtied. The opposite of `isPristine`.

TODO add link to persistent dirty model? Or maybe a reference to isDefaultValue?

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:136](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L136)

Whether the form currently has form-level or field-level errors.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:120](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L120)

Whether the form has not yet been dirtied. The opposite of `isDirty`.

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:152](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L152)

Whether the latest submission completed without validation or submit errors.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:148](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L148)

Whether the form is currently in the process of submitting.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:110](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L110)

Whether the form has been touched.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:132](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L132)

Whether the form currently has no form-level or field-level errors.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:156](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L156)

Whether the form or any field is currently validating.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:162](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L162)

The number of times a submission has been attempted, regardless of its success.

If the form is reset, this will revert back to 0.

***

### values

```ts
values: TFormData;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:106](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L106)

The current values of the form.
