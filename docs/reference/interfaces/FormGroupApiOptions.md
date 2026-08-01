---
id: FormGroupApiOptions
title: FormGroupApiOptions
---

# Interface: FormGroupApiOptions\<TFormData, TGroupName, TGroupValue, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:67](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L67)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### form

```ts
form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:73](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L73)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:74](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L74)

***

### validators?

```ts
optional validators: FormGroupValidators<TGroupValue>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:75](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L75)
