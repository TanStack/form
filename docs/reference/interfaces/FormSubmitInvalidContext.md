---
id: FormSubmitInvalidContext
title: FormSubmitInvalidContext
---

Defined in: [FormApi/FormApi.public.ts:213](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L213)

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

Defined in: [FormApi/FormApi.public.ts:220](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L220)

The form API handling the failed submission.

***

### value

```ts
value: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:218](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L218)

The form values for the failed submission.
