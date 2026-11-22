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

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

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
optional errorVisibility?: ErrorVisibilityFn<TFormData>;
```

Defined in: [FieldApi/FieldApi.public.ts:235](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L235)

***

### listeners?

```ts
optional listeners?: FieldListeners<TFieldData, TFieldName, TFieldValue, NoInfer<FallbackToValidationIssue<
  | ExtractValidatorSelfError<TFieldValidators, FieldValidators<any, any, any>>
  | ExtractSubfieldError<TGroupError>
| ExtractSubfieldError<TFormError>>>, TFormData, TFormError>;
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
