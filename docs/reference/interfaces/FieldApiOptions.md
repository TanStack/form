---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes\>

Defined in: [FieldApi/FieldApi.public.ts:206](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L206)

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

Defined in: [FieldApi/FieldApi.public.ts:224](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L224)

Route descendant field errors from form and form group validators to this field.

***

### errorVisibility?

```ts
optional errorVisibility?: ErrorVisibility<TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:220](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L220)

***

### listeners?

```ts
optional listeners?: FieldListeners<TFieldData, TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorFieldError<NoInfer<TFieldValidators>, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? never : TGroupFieldError
| ExtractFormFieldError<TFormErrorTypes>>, TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:226](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L226)

***

### name

```ts
name: TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:219](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L219)

***

### validators?

```ts
optional validators?: TFieldValidators;
```

Defined in: [FieldApi/FieldApi.public.ts:225](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L225)
