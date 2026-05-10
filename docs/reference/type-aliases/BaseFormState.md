---
id: BaseFormState
title: BaseFormState
---

# Type Alias: BaseFormState\<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer\>

```ts
type BaseFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:552](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L552)

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

Defined in: [packages/form-core/src/FormApi.ts:628](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L628)

@private, used to force a re-evaluation of the form state when options change

***

### errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFormValidateOrFn<TOnMount>, UnwrapFormValidateOrFn<TOnChange>, UnwrapFormAsyncValidateOrFn<TOnChangeAsync>, UnwrapFormValidateOrFn<TOnBlur>, UnwrapFormAsyncValidateOrFn<TOnBlurAsync>, UnwrapFormValidateOrFn<TOnSubmit>, UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>, UnwrapFormValidateOrFn<TOnDynamic>, UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>, UnwrapFormAsyncValidateOrFn<TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:572](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L572)

The error map for the form itself.

***

### fieldMetaBase

```ts
fieldMetaBase: Partial<Record<DeepKeys<TFormData>, AnyFieldMetaBase>>;
```

Defined in: [packages/form-core/src/FormApi.ts:591](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L591)

A record of field metadata for each field in the form, not including the derived properties, like `errors` and such

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:624](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L624)

A boolean indicating if the last submission was successful.

***

### isSubmitted

```ts
isSubmitted: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:612](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L612)

A boolean indicating if the `onSubmit` function has completed successfully.

Goes back to `false` at each new submission attempt.

Note: you can use isSubmitting to check if the form is currently submitting.

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:604](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L604)

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

Defined in: [packages/form-core/src/FormApi.ts:616](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L616)

A boolean indicating if the form or any of its fields are currently validating.

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/FormApi.ts:620](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L620)

A counter for tracking the number of submission attempts.

***

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:587](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L587)

An internal mechanism used for keeping track of validation logic in a form.

***

### values

```ts
values: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:568](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L568)

The current values of the form fields.
