---
id: FormGroupApi
title: FormGroupApi
---

# Interface: FormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L191)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### atom

```ts
atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupErrorTypes>>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:207](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L207)

***

### form

```ts
readonly form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:198](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L198)

***

### handleSubmit()

```ts
handleSubmit: () => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:213](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L213)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### name

```ts
readonly name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:199](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L199)

***

### options

```ts
readonly options: FormGroupApiOptions<TFormData, TGroupName, TGroupValue, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:200](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L200)

***

### reset()

```ts
reset: () => void;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L214)

#### Returns

`void`

***

### state

```ts
readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L208)

***

### validate()

```ts
validate: (signal) => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:210](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L210)

#### Parameters

##### signal

`"submit"` | [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### value

```ts
readonly value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:209](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L209)
