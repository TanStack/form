---
id: DerivedFormState
title: DerivedFormState
---

```ts
type DerivedFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:711](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L711)

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

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:784](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L784)

A boolean indicating if the form can be submitted based on its current state.

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

Defined in: [packages/form-core/src/FormApi.ts:735](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L735)

The error array for the form itself.

***

### fieldMeta

```ts
fieldMeta: Partial<Record<DeepKeys<TFormData>, AnyFieldLikeMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:788](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L788)

A record of field metadata for each field in the form.

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:764](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L764)

A boolean indicating if any of the form fields have been blurred.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:776](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L776)

A boolean indicating if all of the form's fields are the same as default values.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:768](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L768)

A boolean indicating if any of the form's fields' values have been modified by the user. Evaluates `true` if the user have modified at least one of the fields. Opposite of `isPristine`.

***

### isFieldsValid

```ts
isFieldsValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:756](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L756)

A boolean indicating if all the form fields are valid. Evaluates `true` if there are no field errors.

***

### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:752](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L752)

A boolean indicating if any of the form fields are currently validating.

***

### isFormValid

```ts
isFormValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:731](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L731)

A boolean indicating if the form is valid.

***

### isFormValidating

```ts
isFormValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:727](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L727)

A boolean indicating if the form is currently validating.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:772](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L772)

A boolean indicating if none of the form's fields' values have been modified by the user. Evaluates `true` if the user have not modified any of the fields. Opposite of `isDirty`.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:760](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L760)

A boolean indicating if any of the form fields have been touched.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:780](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L780)

A boolean indicating if the form and all its fields are valid. Evaluates `true` if there are no errors.
