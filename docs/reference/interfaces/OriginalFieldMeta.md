---
id: OriginalFieldMeta
title: OriginalFieldMeta
---

# Interface: OriginalFieldMeta\<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:32](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L32)

## Type Parameters

### TFieldValidatorMetas

`TFieldValidatorMetas` *extends* [`FieldValidatorMetas`](../type-aliases/FieldValidatorMetas.md)

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### errors

```ts
errors: FieldErrors<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:38](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L38)

***

### isInvalid

```ts
isInvalid: boolean;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:45](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L45)

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:44](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L44)
