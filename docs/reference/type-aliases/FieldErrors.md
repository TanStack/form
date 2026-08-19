---
id: FieldErrors
title: FieldErrors
---

# Type Alias: FieldErrors\<TFieldError\>

```ts
type FieldErrors<TFieldError> = unknown extends TFieldError ? ValidationIssue : TFieldError[];
```

Defined in: [validation.public.ts:619](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L619)

## Type Parameters

### TFieldError

`TFieldError`
