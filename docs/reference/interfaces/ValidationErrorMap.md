---
id: ValidationErrorMap
title: ValidationErrorMap
---

Defined in: [validation/state.public.ts:61](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L61)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* [`ValidationFailure`](../type-aliases/ValidationFailure.md)

### TFieldError

`TFieldError` *extends* [`ValidationFailure`](../type-aliases/ValidationFailure.md)

## Properties

### fields

```ts
fields: ValidationFieldMap<TFormData, TFieldError>;
```

Defined in: [validation/state.public.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L67)

***

### form?

```ts
optional form?: TFormError;
```

Defined in: [validation/state.public.ts:66](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L66)
