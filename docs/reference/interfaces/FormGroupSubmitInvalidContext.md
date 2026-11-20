---
id: FormGroupSubmitInvalidContext
title: FormGroupSubmitInvalidContext
---

Defined in: [FormGroupApi/FormGroupApi.public.ts:81](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L81)

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

### TGroupError

`TGroupError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:91](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L91)

The parent form API handling the failed submission.

***

### groupApi

```ts
groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupError, TFormError>;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:93](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L93)

The group API handling the failed submission.

***

### value

```ts
value: TGroupValue;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:89](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L89)

The group values for the failed submission.
