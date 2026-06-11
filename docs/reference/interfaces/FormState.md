---
id: FormState
title: FormState
---

# Interface: FormState\<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer\>

Defined in: [packages/form-core/src/FormApi.ts:793](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L793)

An object representing the current state of the form.

## Extends

- [`BaseFormState`](../type-aliases/BaseFormState.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`\>.[`DerivedFormState`](../type-aliases/DerivedFormState.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`\>

## Type Parameters

### TFormData

`TFormData`

### TOnMount

`TOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

## Properties

### \_force\_re\_eval?

```ts
optional _force_re_eval: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:696](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L696)

@private, used to force a re-evaluation of the form state when options change

#### Inherited from

```ts
BaseFormState._force_re_eval
```

***

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:786](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L786)

A boolean indicating if the form can be submitted based on its current state.

#### Inherited from

```ts
DerivedFormState.canSubmit
```

***

### errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFormValidateOrFn<TOnMount>, UnwrapFormValidateOrFn<TOnChange>, UnwrapFormAsyncValidateOrFn<TOnChangeAsync>, UnwrapFormValidateOrFn<TOnBlur>, UnwrapFormAsyncValidateOrFn<TOnBlurAsync>, UnwrapFormValidateOrFn<TOnSubmit>, UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>, UnwrapFormValidateOrFn<TOnDynamic>, UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>, UnwrapFormAsyncValidateOrFn<TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:633](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L633)

The error map for the form itself.

#### Inherited from

```ts
BaseFormState.errorMap
```

***

### errors

```ts
errors: NonNullable<
  | UnwrapFormValidateOrFn<TOnMount>
  | UnwrapFormValidateOrFn<TOnChange>
  | UnwrapFormAsyncValidateOrFn<TOnChangeAsync>
  | UnwrapFormValidateOrFn<TOnBlur>
  | UnwrapFormAsyncValidateOrFn<TOnBlurAsync>
  | UnwrapFormValidateOrFn<TOnSubmit>
  | UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>
  | UnwrapFormValidateOrFn<TOnDynamic>
  | UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>
  | UnwrapFormAsyncValidateOrFn<TOnServer>>[];
```

Defined in: [packages/form-core/src/FormApi.ts:737](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L737)

The error array for the form itself.

#### Inherited from

```ts
DerivedFormState.errors
```

***

### fieldMeta

```ts
fieldMeta: Partial<Record<DeepKeys<TFormData>, AnyFieldLikeMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:790](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L790)

A record of field metadata for each field in the form.

#### Inherited from

```ts
DerivedFormState.fieldMeta
```

***

### fieldMetaBase

```ts
fieldMetaBase: Partial<Record<DeepKeys<TFormData>, AnyFieldLikeMetaBase>>;
```

Defined in: [packages/form-core/src/FormApi.ts:652](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L652)

A record of field metadata for each field in the form, not including the derived properties, like `errors` and such

#### Inherited from

```ts
BaseFormState.fieldMetaBase
```

***

### formGroupStateBase

```ts
formGroupStateBase: Partial<Record<string, FormGroupState>>;
```

Defined in: [packages/form-core/src/FormApi.ts:659](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L659)

A record of submission lifecycle state for each mounted `FormGroupApi`,
keyed by the group's fully-qualified field name. Stored on the form so
group-level state can be read from `FormApi` without having to walk the
mounted group instances.

#### Inherited from

```ts
BaseFormState.formGroupStateBase
```

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:766](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L766)

A boolean indicating if any of the form fields have been blurred.

#### Inherited from

```ts
DerivedFormState.isBlurred
```

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:778](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L778)

A boolean indicating if all of the form's fields are the same as default values.

#### Inherited from

```ts
DerivedFormState.isDefaultValue
```

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:770](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L770)

A boolean indicating if any of the form's fields' values have been modified by the user. Evaluates `true` if the user have modified at least one of the fields. Opposite of `isPristine`.

#### Inherited from

```ts
DerivedFormState.isDirty
```

***

### isFieldsValid

```ts
isFieldsValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:758](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L758)

A boolean indicating if all the form fields are valid. Evaluates `true` if there are no field errors.

#### Inherited from

```ts
DerivedFormState.isFieldsValid
```

***

### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:754](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L754)

A boolean indicating if any of the form fields are currently validating.

#### Inherited from

```ts
DerivedFormState.isFieldsValidating
```

***

### isFormValid

```ts
isFormValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:733](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L733)

A boolean indicating if the form is valid.

#### Inherited from

```ts
DerivedFormState.isFormValid
```

***

### isFormValidating

```ts
isFormValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:729](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L729)

A boolean indicating if the form is currently validating.

#### Inherited from

```ts
DerivedFormState.isFormValidating
```

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:774](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L774)

A boolean indicating if none of the form's fields' values have been modified by the user. Evaluates `true` if the user have not modified any of the fields. Opposite of `isDirty`.

#### Inherited from

```ts
DerivedFormState.isPristine
```

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:692](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L692)

A boolean indicating if the last submission was successful.

#### Inherited from

```ts
BaseFormState.isSubmitSuccessful
```

***

### isSubmitted

```ts
isSubmitted: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:680](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L680)

A boolean indicating if the `onSubmit` function has completed successfully.

Goes back to `false` at each new submission attempt.

Note: you can use isSubmitting to check if the form is currently submitting.

#### Inherited from

```ts
BaseFormState.isSubmitted
```

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:672](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L672)

A boolean indicating if the form is currently in the process of being submitted after `handleSubmit` is called.

Goes back to `false` when submission completes for one of the following reasons:
- the validation step returned errors.
- the `onSubmit` function has completed.

Note: if you're running async operations in your `onSubmit` function make sure to await them to ensure `isSubmitting` is set to `false` only when the async operation completes.

This is useful for displaying loading indicators or disabling form inputs during submission.

#### Inherited from

```ts
BaseFormState.isSubmitting
```

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:762](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L762)

A boolean indicating if any of the form fields have been touched.

#### Inherited from

```ts
DerivedFormState.isTouched
```

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:782](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L782)

A boolean indicating if the form and all its fields are valid. Evaluates `true` if there are no errors.

#### Inherited from

```ts
DerivedFormState.isValid
```

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:684](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L684)

A boolean indicating if the form or any of its fields are currently validating.

#### Inherited from

```ts
BaseFormState.isValidating
```

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/FormApi.ts:688](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L688)

A counter for tracking the number of submission attempts.

#### Inherited from

```ts
BaseFormState.submissionAttempts
```

***

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:648](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L648)

An internal mechanism used for keeping track of validation logic in a form.

#### Inherited from

```ts
BaseFormState.validationMetaMap
```

***

### values

```ts
values: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:629](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L629)

The current values of the form fields.

#### Inherited from

```ts
BaseFormState.values
```
