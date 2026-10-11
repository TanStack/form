---
id: FieldErrors
title: FieldErrors
---

```ts
type FieldErrors<TFieldError> = unknown extends TFieldError ? ValidationIssue : TFieldError[];
```

Defined in: [validation.public.ts:1110](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1110)

A field's error array, with string messages normalized to issue objects.

## Type Parameters

### TFieldError

`TFieldError`

Library-managed. Do not specify explicitly.
