---
id: FormGroupApi
title: FormGroupApi
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:195](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L195)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:205](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L205)

***

### form

```ts
readonly form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:202](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L202)

***

### handleSubmit

```ts
handleSubmit: () => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:211](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L211)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### name

```ts
readonly name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:203](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L203)

***

### reset

```ts
reset: () => void;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:212](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L212)

#### Returns

`void`

***

### state

```ts
readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:206](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L206)

***

### validate

```ts
validate: (signal) => Promise<FormGroupValidateResult<TGroupValue>[]>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L208)

#### Parameters

##### signal

  \| `"submit"`
  \| [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)

#### Returns

`Promise`\<[`FormGroupValidateResult`](../type-aliases/FormGroupValidateResult.md)\<`TGroupValue`\>[]\>

***

### value

```ts
readonly value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:207](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L207)
