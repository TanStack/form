---
id: FieldState
title: FieldState
---

# Interface: FieldState\<TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FieldApi/FieldApi.public.ts:78](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L78)

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

Defined in: [FieldApi/FieldApi.public.ts:86](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L86)

***

### value

```ts
value: TFieldValue;
```

Defined in: [FieldApi/FieldApi.public.ts:85](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L85)
