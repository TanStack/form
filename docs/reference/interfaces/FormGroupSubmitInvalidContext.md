---
id: FormGroupSubmitInvalidContext
title: FormGroupSubmitInvalidContext
---

# Interface: FormGroupSubmitInvalidContext\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes\>

Defined in: [FormGroupApi/FormGroupApi.public.ts:79](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L79)

Context passed to a form group's `onSubmitInvalid` when submission fails.

## Example

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

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:89](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L89)

The parent form API handling the failed submission.

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:91](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L91)

The group API handling the failed submission.

***

### value

```ts
value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:87](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L87)

The group values for the failed submission.
