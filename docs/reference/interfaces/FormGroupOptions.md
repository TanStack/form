---
id: FormGroupOptions
title: FormGroupOptions
---

# Interface: FormGroupOptions\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:33](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L33)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](../type-aliases/FormGroupValidators.md)\<`TGroupValue`\>

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### form

```ts
form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:41](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L41)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:42](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L42)

***

### onSubmit()?

```ts
optional onSubmit: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:44](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L44)

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupValidatorMetas`](../type-aliases/ToFormGroupValidatorMetas.md)\<`TGroupValidators`\>, `TFormValidatorMetas`, `TSubmitReturn`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:54](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L54)

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupValidatorMetas`](../type-aliases/ToFormGroupValidatorMetas.md)\<`TGroupValidators`\>, `TFormValidatorMetas`, `TSubmitReturn`\> & `object`

#### Returns

`void` \| `Promise`\<`void`\>

***

### validators?

```ts
optional validators: TGroupValidators;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:43](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L43)
