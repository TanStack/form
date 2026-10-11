---
id: FormGroupSubmitContext
title: FormGroupSubmitContext
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:26](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L26)

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

### TGroupErrorTypes

`TGroupErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:37](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L37)

The parent form API handling this submission.

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:39](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L39)

The group API handling this submission.

***

### validatorOutputs

```ts
validatorOutputs: TOutputs;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L62)

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

Defined in: [FormGroupApi/FormGroupApi.public.ts:35](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L35)

The group values for this submission.
