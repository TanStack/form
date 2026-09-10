---
id: FormSubmitInvalidContext
title: FormSubmitInvalidContext
---

# Interface: FormSubmitInvalidContext\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L214)

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

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:221](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L221)

The form API handling the failed submission.

***

### value

```ts
value: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:219](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L219)

The form values for the failed submission.
