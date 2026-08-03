---
id: FormGroupApiOptions
title: FormGroupApiOptions
---

# Interface: FormGroupApiOptions\<TFormData, TGroupName, TGroupValue, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:161](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L161)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:167](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L167)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:168](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L168)

***

### validators?

```ts
optional validators: FormGroupValidators<TGroupValue>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:169](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L169)
