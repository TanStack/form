---
id: FieldState
title: FieldState
---

# Interface: FieldState\<TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:79](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L79)

## Type Parameters

### TFieldValue

`TFieldValue`

### TFieldValidatorMetas

`TFieldValidatorMetas` *extends* [`FieldValidatorMetas`](../type-aliases/FieldValidatorMetas.md)

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### meta

```ts
meta: FieldMeta<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:87](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L87)

***

### value

```ts
value: TFieldValue;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:86](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L86)
