---
id: FieldApiOptions
title: FieldApiOptions
---

Defined in: [FieldApi/FieldApi.public.ts:221](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L221)

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
optional errorBoundary?: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:239](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L239)

Route descendant field errors from form and form group validators to this field.

***

### errorVisibility?

```ts
optional errorVisibility?: ErrorVisibility<TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:235](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L235)

***

### listeners?

```ts
optional listeners?: FieldListeners<TFieldData, TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorFieldError<NoInfer<TFieldValidators>, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? never : TGroupFieldError
| ExtractFormFieldError<TFormErrorTypes>>, TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:241](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L241)

***

### name

```ts
name: TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:234](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L234)

***

### validators?

```ts
optional validators?: TFieldValidators;
```

Defined in: [FieldApi/FieldApi.public.ts:240](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L240)
