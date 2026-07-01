---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupValidators, TFormData, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:247](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L247)

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

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:270](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L270)

Route descendant field errors from form-level validation to this field.

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:262](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L262)

***

### listeners?

```ts
optional listeners: FieldListeners<TFieldData, TFieldName, TFieldValue, ToFieldValidatorMetas<TFieldValidators>, TGroupValidators, TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:272](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L272)

***

### name

```ts
name: TFieldName;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:261](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L261)

***

### validators?

```ts
optional validators: TFieldValidators;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:271](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L271)
