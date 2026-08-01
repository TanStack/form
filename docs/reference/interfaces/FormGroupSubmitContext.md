---
id: FormGroupSubmitContext
title: FormGroupSubmitContext
---

# Interface: FormGroupSubmitContext\<TFormData, TGroupName, TGroupValue, TSchemaOutputs, TGroupErrorTypes, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:13](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L13)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TSchemaOutputs

`TSchemaOutputs`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:22](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L22)

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:23](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L23)

***

### schemaOutputs

```ts
schemaOutputs: TSchemaOutputs;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:30](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L30)

***

### value

```ts
value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:21](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L21)
