---
id: FormGroupSubmitContext
title: FormGroupSubmitContext
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:27](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L27)

Context passed to a form group's `onSubmit` after group validation succeeds.

## Example

```ts
{
  // ...
  onSubmit: async ({ value }) => {
    await saveGuestDetails(value)
  },
}
```

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TOutputs

`TOutputs`

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:38](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L38)

The parent form API handling this submission.

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupError, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:40](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L40)

The group API handling this submission.

***

### validatorOutputs

```ts
validatorOutputs: TOutputs;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:63](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L63)

Schema outputs and `createOutput` payloads from this group submission,
ordered by validator index. Skipped validators and successful returns
without an output contribute `undefined`.

#### Example

```ts
{
  // ...
  onSubmit: async ({ validatorOutputs }) => {
    const validatedGuestDetails = validatorOutputs[0]
    setStep(step => step + 1)
  },
}
```

***

### value

```ts
value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:36](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L36)

The group values for this submission.
