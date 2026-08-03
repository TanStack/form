---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes\>

Defined in: [FieldApi/FieldApi.public.ts:189](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L189)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](../type-aliases/FieldValidators.md)\<`TFieldData`, `TFieldName`, `TFieldValue`\>

### TGroupFieldError

`TGroupFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### errorBoundary?

```ts
optional errorBoundary: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:207](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L207)

Route descendant field errors from form-level validation to this field.

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:203](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L203)

***

### listeners?

```ts
optional listeners: FieldListeners<TFieldData, TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorFieldError<NoInfer<TFieldValidators>, FieldValidators<any, any, any>>
  | ExtractFormFieldError<TFormErrorTypes>
| unknown extends TGroupFieldError ? never : TGroupFieldError>, TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:209](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L209)

***

### name

```ts
name: TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:202](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L202)

***

### validators?

```ts
optional validators: TFieldValidators;
```

Defined in: [FieldApi/FieldApi.public.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L208)
