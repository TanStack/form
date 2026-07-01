---
id: FormGroupApiOptions
title: FormGroupApiOptions
---

# Interface: FormGroupApiOptions\<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:68](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L68)

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

### form

```ts
form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:76](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L76)

***

### name

```ts
name: TGroupName;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:77](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L77)

***

### onSubmit()?

```ts
optional onSubmit: (context) => void | Promise<void>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:79](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L79)

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidatorMetas`, `TFormValidatorMetas`, `TSubmitReturn`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (context) => void | Promise<void>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:89](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L89)

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidatorMetas`, `TFormValidatorMetas`, `TSubmitReturn`\> & `object`

#### Returns

`void` \| `Promise`\<`void`\>

***

### validators?

```ts
optional validators: FormGroupValidators<TGroupValue>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:78](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L78)
