---
id: FormGroupOptions
title: FormGroupOptions
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:135](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L135)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](../type-aliases/FormGroupValidators.md)\<`TGroupValue`\>

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

## Properties

### form

```ts
form: FormApi<TFormData, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:142](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L142)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:143](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L143)

***

### onSubmit?

```ts
optional onSubmit?: FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:171](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L171)

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
optional onSubmitInvalid?: FormGroupOnSubmitInvalidFn<TFormData, TGroupName, TGroupValue, NoInfer<ToFormGroupErrorTypes<TGroupValidators>>, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:194](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L194)

Called when group validation fails or validation or submission throws. The
callback is awaited before submission finishes.

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
optional validators?: { [K in string | number | symbol]: TGroupValidators[K] & Record<Exclude<keyof TGroupValidators[K], keyof FormGroupValidator<TGroupValue>>, never> };
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:144](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L144)
