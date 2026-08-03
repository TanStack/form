---
id: FormSubmitInvalidContext
title: FormSubmitInvalidContext
---

# Interface: FormSubmitInvalidContext\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:135](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L135)

Context passed to `onSubmitInvalid` when a submission fails.

## Example

```ts
{
  // ...
  onSubmitInvalid: () => {
    document
      .querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
  },
}
```

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:142](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L142)

The form API handling the failed submission.

***

### value

```ts
value: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:140](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L140)

The form values for the failed submission.
