---
id: FormattedValidationErrorMap
title: FormattedValidationErrorMap
---

Defined in: [validation/results/results.public.ts:90](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L90)

Form and field errors after strings have been converted to issue objects.
Contains error data without the methods supplied by error-map helpers.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### fields

```ts
fields: ValidationFieldMap<TFormData, ValidationIssue[]>;
```

Defined in: [validation/results/results.public.ts:92](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L92)

***

### form

```ts
form: ValidationIssue[];
```

Defined in: [validation/results/results.public.ts:91](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L91)
