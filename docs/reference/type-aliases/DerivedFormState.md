---
id: DerivedFormState
title: DerivedFormState
---

# Type Alias: DerivedFormState\<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer\>

```ts
type DerivedFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:645](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L645)

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

Defined in: [packages/form-core/src/FormApi.ts:718](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L718)

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

Defined in: [packages/form-core/src/FormApi.ts:669](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L669)

The error array for the form itself.

***

### fieldMeta

```ts
fieldMeta: Partial<Record<DeepKeys<TFormData>, AnyFieldMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:722](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L722)

A record of field metadata for each field in the form.

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:698](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L698)

A boolean indicating if any of the form fields have been blurred.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:710](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L710)

A boolean indicating if all of the form's fields are the same as default values.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:702](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L702)

A boolean indicating if any of the form's fields' values have been modified by the user. Evaluates `true` if the user have modified at least one of the fields. Opposite of `isPristine`.

***

### isFieldsValid

```ts
isFieldsValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:690](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L690)

A boolean indicating if all the form fields are valid. Evaluates `true` if there are no field errors.

***

### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:686](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L686)

A boolean indicating if any of the form fields are currently validating.

***

### isFormValid

```ts
isFormValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:665](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L665)

A boolean indicating if the form is valid.

***

### isFormValidating

```ts
isFormValidating: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:661](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L661)

A boolean indicating if the form is currently validating.

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:706](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L706)

A boolean indicating if none of the form's fields' values have been modified by the user. Evaluates `true` if the user have not modified any of the fields. Opposite of `isDirty`.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:694](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L694)

A boolean indicating if any of the form fields have been touched.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:714](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L714)

A boolean indicating if the form and all its fields are valid. Evaluates `true` if there are no errors.
