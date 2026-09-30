---
id: BaseFormState
title: BaseFormState
---

```ts
type BaseFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:611](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L611)

An object representing the current state of the form.

## Extended by

- [`FormState`](../interfaces/FormState.md)

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

Defined in: [packages/form-core/src/FormApi.ts:694](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L694)

@private, used to force a re-evaluation of the form state when options change

***

### errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFormValidateOrFn<TOnMount>, UnwrapFormValidateOrFn<TOnChange>, UnwrapFormAsyncValidateOrFn<TOnChangeAsync>, UnwrapFormValidateOrFn<TOnBlur>, UnwrapFormAsyncValidateOrFn<TOnBlurAsync>, UnwrapFormValidateOrFn<TOnSubmit>, UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>, UnwrapFormValidateOrFn<TOnDynamic>, UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>, UnwrapFormAsyncValidateOrFn<TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:631](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L631)

The error map for the form itself.

***

### fieldMetaBase

```ts
fieldMetaBase: Partial<Record<DeepKeys<TFormData>, AnyFieldLikeMetaBase>>;
```

Defined in: [packages/form-core/src/FormApi.ts:650](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L650)

A record of field metadata for each field in the form, not including the derived properties, like `errors` and such

***

### formGroupStateBase

```ts
formGroupStateBase: Partial<Record<string, FormGroupState>>;
```

Defined in: [packages/form-core/src/FormApi.ts:657](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L657)

A record of submission lifecycle state for each mounted `FormGroupApi`,
keyed by the group's fully-qualified field name. Stored on the form so
group-level state can be read from `FormApi` without having to walk the
mounted group instances.

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:690](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L690)

A boolean indicating if the last submission was successful.

***

### isSubmitted

```ts
isSubmitted: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:678](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L678)

A boolean indicating if the `onSubmit` function has completed successfully.

Goes back to `false` at each new submission attempt.

Note: you can use isSubmitting to check if the form is currently submitting.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:670](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L670)

A boolean indicating if the form is currently in the process of being submitted after `handleSubmit` is called.

Goes back to `false` when submission completes for one of the following reasons:
- the validation step returned errors.
- the `onSubmit` function has completed.

Note: if you're running async operations in your `onSubmit` function make sure to await them to ensure `isSubmitting` is set to `false` only when the async operation completes.

This is useful for displaying loading indicators or disabling form inputs during submission.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:682](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L682)

A boolean indicating if the form or any of its fields are currently validating.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/FormApi.ts:686](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L686)

A counter for tracking the number of submission attempts.

***

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:646](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L646)

An internal mechanism used for keeping track of validation logic in a form.

***

### values

```ts
values: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:627](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L627)

The current values of the form fields.
