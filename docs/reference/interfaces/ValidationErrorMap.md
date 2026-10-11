---
id: ValidationErrorMap
title: ValidationErrorMap
---

Defined in: [validation.public.ts:595](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L595)

Errors owned by a form or group and errors routed to its fields.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### fields

```ts
fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>;
```

Defined in: [validation.public.ts:599](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L599)

Errors keyed by field path. Paths are relative to the group for group validators.

***

### form?

```ts
optional form?: ValidationErrorInput;
```

Defined in: [validation.public.ts:597](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L597)

Errors for the form or group that owns the validator.
