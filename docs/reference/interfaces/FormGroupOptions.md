---
id: FormGroupOptions
title: FormGroupOptions
---

# Interface: FormGroupOptions\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes\>

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

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### form

```ts
form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:40](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L40)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:41](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L41)

***

### onSubmit()?

```ts
optional onSubmit: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:43](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L43)

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupSchemaOutputs`](../type-aliases/ToFormGroupSchemaOutputs.md)\<`TGroupValidators`\>, [`ToFormGroupErrorTypes`](../type-aliases/ToFormGroupErrorTypes.md)\<`TGroupValidators`\>, `TFormErrorTypes`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:53](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L53)

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupSchemaOutputs`](../type-aliases/ToFormGroupSchemaOutputs.md)\<`TGroupValidators`\>, [`ToFormGroupErrorTypes`](../type-aliases/ToFormGroupErrorTypes.md)\<`TGroupValidators`\>, `TFormErrorTypes`\> & `object`

#### Returns

`void` \| `Promise`\<`void`\>

***

### validators?

```ts
optional validators: TGroupValidators;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:42](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L42)
