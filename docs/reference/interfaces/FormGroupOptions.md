---
id: FormGroupOptions
title: FormGroupOptions
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:118](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L118)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:125](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L125)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:126](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L126)

***

### onSubmit?

```ts
optional onSubmit?: FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:142](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L142)

Called after group submission validation succeeds. The callback is awaited
before submission finishes.

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

### onSubmitInvalid?

```ts
optional onSubmitInvalid?: (context) => void | Promise<void>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:165](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L165)

Called when group validation fails or validation or submission throws. The
callback is awaited before submission finishes.

#### Parameters

##### context

[`FormGroupSubmitInvalidContext`](FormGroupSubmitInvalidContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupErrorTypes`](../type-aliases/ToFormGroupErrorTypes.md)\<`NoInfer`\<`TGroupValidators`\>\>, `TFormErrorTypes`\>

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
optional validators?: TGroupValidators;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:127](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L127)
