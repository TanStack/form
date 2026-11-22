---
id: FormGroupOptions
title: FormGroupOptions
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:203](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L203)

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

### TSubmitReturn

`TSubmitReturn` = `void`

## Properties

### form

```ts
form: FormApi<TFormData, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:211](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L211)

***

### name

```ts
name: TGroupName;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:212](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L212)

***

### onSubmit?

```ts
optional onSubmit?: FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TSubmitReturn>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:244](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L244)

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
optional onSubmitInvalid?: FormGroupOnSubmitInvalidFn<TFormData, TGroupName, TGroupValue, NoInfer<ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>>, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:268](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L268)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:217](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L217)
