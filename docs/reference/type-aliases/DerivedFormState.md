---
id: DerivedFormState
title: DerivedFormState
---

# Type Alias: DerivedFormState\<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer\>

```ts
type DerivedFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:621](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L621)

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

Defined in: [packages/form-core/src/FormApi.ts:692](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L692)

A boolean indicating if the form can be submitted based on its current state.

***

### errors

```ts
errors: (
  | UnwrapFormValidateOrFn<TOnMount>
  | UnwrapFormValidateOrFn<TOnChange>
  | UnwrapFormAsyncValidateOrFn<TOnChangeAsync>
  | UnwrapFormValidateOrFn<TOnBlur>
  | UnwrapFormAsyncValidateOrFn<TOnBlurAsync>
  | UnwrapFormValidateOrFn<TOnSubmit>
  | UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>
  | UnwrapFormValidateOrFn<TOnDynamic>
  | UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>
  | UnwrapFormAsyncValidateOrFn<TOnServer>)[];
```

Defined in: [packages/form-core/src/FormApi.ts:645](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L645)

The error array for the form itself.

***

### fieldMeta

```ts
fieldMeta: Partial<Record<DeepKeys<TFormData>, AnyFieldMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:696](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L696)

A record of field metadata for each field in the form.

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:672](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L672)

A boolean indicating if any of the form fields have been blurred.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:684](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L684)

A boolean indicating if all of the form's fields are the same as default values.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:676](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L676)

A boolean indicating if any of the form's fields' values have been modified by the user. Evaluates `true` if the user have modified at least one of the fields. Opposite of `isPristine`.

***

### isFieldsValid

```ts
isFieldsValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:664](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L664)

A boolean indicating if all the form fields are valid. Evaluates `true` if there are no field errors.

***

### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:660](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L660)

A boolean indicating if any of the form fields are currently validating.

***

### isFormValid

```ts
isFormValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:641](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L641)

A boolean indicating if the form is valid.

***

### isFormValidating

```ts
isFormValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:637](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L637)

A boolean indicating if the form is currently validating.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:680](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L680)

A boolean indicating if none of the form's fields' values have been modified by the user. Evaluates `true` if the user have not modified any of the fields. Opposite of `isDirty`.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:668](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L668)

A boolean indicating if any of the form fields have been touched.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:688](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L688)

A boolean indicating if the form and all its fields are valid. Evaluates `true` if there are no errors.
