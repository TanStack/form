---
id: FormSubmitInvalidContext
title: FormSubmitInvalidContext
---

# Interface: FormSubmitInvalidContext\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:191](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L191)

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

Defined in: [FormApi/FormApi.public.ts:198](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L198)

The form API handling the failed submission.

***

### value

```ts
value: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:196](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L196)

The form values for the failed submission.
