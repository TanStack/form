---
id: FormGroupApi
title: FormGroupApi
---

# Interface: FormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes\>

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:97](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L97)

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

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:113](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L113)

***

### form

```ts
readonly form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:104](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L104)

***

### handleSubmit()

```ts
handleSubmit: () => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:119](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L119)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### name

```ts
readonly name: TGroupName;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:105](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L105)

***

### options

```ts
readonly options: FormGroupApiOptions<TFormData, TGroupName, TGroupValue, TFormErrorTypes>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:106](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L106)

***

### reset()

```ts
reset: () => void;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:120](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L120)

#### Returns

`void`

***

### state

```ts
readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:114](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L114)

***

### validate()

```ts
validate: (signal?) => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:116](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L116)

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

Defined in: [packages/form-core/src/FormGroupApi/FormGroupApi.public.ts:115](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L115)
