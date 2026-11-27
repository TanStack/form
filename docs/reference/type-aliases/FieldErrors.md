---
id: FieldErrors
title: FieldErrors
---

```ts
type FieldErrors<TFieldError> = unknown extends TFieldError ? ValidationIssue : TFieldError[];
```

Defined in: [validation/state.public.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L191)

A field's error array, with string messages normalized to issue objects.

## Type Parameters

### TFieldError

`TFieldError`

Library-managed. Do not specify explicitly.
