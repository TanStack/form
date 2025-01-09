---
id: BaseFormState
title: BaseFormState
---

# Type Alias: BaseFormState\<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

```ts
type BaseFormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>: object;
```

An object representing the current state of the form.

## Type Parameters

• **TFormData**

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Type declaration

### errorMap

```ts
errorMap: FormValidationErrorMap<TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>;
```

The error map for the form itself.

### fieldMetaBase

```ts
fieldMetaBase: Record<DeepKeys<TFormData>, FieldMetaBase>;
```

A record of field metadata for each field in the form, not including the derived properties, like `errors` and such

### isSubmitted

```ts
isSubmitted: boolean;
```

A boolean indicating if the form has been submitted.

### isSubmitting

```ts
isSubmitting: boolean;
```

A boolean indicating if the form is currently in the process of being submitted after `handleSubmit` is called.

Goes back to `false` when submission completes for one of the following reasons:
- the validation step returned errors.
- the `onSubmit` function has completed.

Note: if you're running async operations in your `onSubmit` function make sure to await them to ensure `isSubmitting` is set to `false` only when the async operation completes.

This is useful for displaying loading indicators or disabling form inputs during submission.

### isValidating

```ts
isValidating: boolean;
```

A boolean indicating if the form or any of its fields are currently validating.

### submissionAttempts

```ts
submissionAttempts: number;
```

A counter for tracking the number of submission attempts.

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

An internal mechanism used for keeping track of validation logic in a form.

### values

```ts
values: TFormData;
```

The current values of the form fields.

## Defined in

[packages/form-core/src/FormApi.ts:381](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L381)
