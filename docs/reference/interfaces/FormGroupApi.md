---
id: FormGroupApi
title: FormGroupApi
---

# Interface: FormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:180](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L180)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:190](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L190)

***

### form

```ts
readonly form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L187)

***

### handleSubmit()

```ts
handleSubmit: () => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:196](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L196)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### name

```ts
readonly name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:188](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L188)

***

### reset()

```ts
reset: () => void;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:197](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L197)

#### Returns

`void`

***

### state

```ts
readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L191)

***

### validate()

```ts
validate: (signal) => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:193](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L193)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:192](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L192)
