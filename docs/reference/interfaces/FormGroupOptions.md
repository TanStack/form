---
id: FormGroupOptions
title: FormGroupOptions
---

# Interface: FormGroupOptions\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:100](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L100)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:107](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L107)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:108](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L108)

***

### onSubmit()?

```ts
optional onSubmit: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:124](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L124)

Called after group submission validation succeeds. The callback is awaited
before submission finishes.

#### Parameters

##### context

[`FormGroupSubmitContext`](FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupSchemaOutputs`](../type-aliases/ToFormGroupSchemaOutputs.md)\<`TGroupValidators`\>, [`ToFormGroupErrorTypes`](../type-aliases/ToFormGroupErrorTypes.md)\<`TGroupValidators`\>, `TFormErrorTypes`\>

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```ts
{
  // ...
  onSubmit: () => {
    setStep(step => step + 1)
  },
}
```

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:150](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L150)

Called when group validation fails or validation or submission throws. The
callback is awaited before submission finishes.

#### Parameters

##### context

[`FormGroupSubmitInvalidContext`](FormGroupSubmitInvalidContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupErrorTypes`](../type-aliases/ToFormGroupErrorTypes.md)\<`TGroupValidators`\>, `TFormErrorTypes`\>

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```ts
{
  // ...
  onSubmitInvalid: ({ groupApi }) => {
    document
      .querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
  },
}
```

***

### validators?

```ts
optional validators: TGroupValidators;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:109](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L109)
