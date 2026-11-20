---
id: FormSubmitInvalidContext
title: FormSubmitInvalidContext
---

Defined in: [FormApi/formSubmit.public.ts:203](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L203)

The form values and form instance passed to `onSubmitInvalid` after a failed
submission.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### formApi

```ts
formApi: FormApi<TFormData, TFormError>;
```

Defined in: [FormApi/formSubmit.public.ts:210](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L210)

The form instance handling the failed submission.

***

### value

```ts
value: TFormData;
```

Defined in: [FormApi/formSubmit.public.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L208)

The form values for the failed submission, without schema transformations applied.
