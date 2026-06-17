---
id: FormGroupApi
title: FormGroupApi
---

# Interface: FormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:134](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L134)

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

### atom

```ts
atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupValidatorMetas>>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:153](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L153)

***

### form

```ts
readonly form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:142](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L142)

***

### handleSubmit()

```ts
handleSubmit: () => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:159](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L159)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### name

```ts
readonly name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:143](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L143)

***

### options

```ts
readonly options: FormGroupApiOptions<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:144](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L144)

***

### reset()

```ts
reset: () => void;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:160](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L160)

#### Returns

`void`

***

### state

```ts
readonly state: FormGroupState<TGroupValue, TGroupValidatorMetas>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:154](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L154)

***

### validate()

```ts
validate: (signal?) => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:156](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L156)

#### Parameters

##### signal?

`"submit"` | [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### value

```ts
readonly value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:155](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L155)
