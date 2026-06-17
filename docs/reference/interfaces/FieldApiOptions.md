---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupValidators, TFormData, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FieldApi/FieldApi.public.ts:246](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L246)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* [`FieldValidators`](../type-aliases/FieldValidators.md)\<`TFieldData`, `TFieldName`, `TFieldValue`\>

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### errorBoundary?

```ts
optional errorBoundary: boolean;
```

Defined in: [FieldApi/FieldApi.public.ts:269](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L269)

Route descendant field errors from form-level validation to this field.

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:261](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L261)

***

### listeners?

```ts
optional listeners: FieldListeners<TFieldData, TFieldName, TFieldValue, ToFieldValidatorMetas<TFieldValidators>, TGroupValidators, TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:271](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L271)

***

### name

```ts
name: TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:260](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L260)

***

### validators?

```ts
optional validators: TFieldValidators;
```

Defined in: [FieldApi/FieldApi.public.ts:270](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L270)
