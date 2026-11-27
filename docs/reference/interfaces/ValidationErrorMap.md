---
id: ValidationErrorMap
title: ValidationErrorMap
---

Defined in: [validation/results/results.public.ts:57](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L57)

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

Defined in: [validation/results/results.public.ts:63](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L63)

***

### form?

```ts
optional form?: TFormError;
```

Defined in: [validation/results/results.public.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L62)
