---
id: FormGroupSubmitContext
title: FormGroupSubmitContext
---

# Interface: FormGroupSubmitContext\<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:12](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L12)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:21](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L21)

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:22](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L22)

***

### schemaOutputs

```ts
schemaOutputs: FormGroupStandardSchemaValidatorOutputs<TGroupValidatorMetas>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:30](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L30)

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:20](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L20)
