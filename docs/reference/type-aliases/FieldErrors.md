---
id: FieldErrors
title: FieldErrors
---

# Type Alias: FieldErrors\<TFieldError\>

```ts
type FieldErrors<TFieldError> = unknown extends TFieldError ? ValidationIssue : TFieldError[];
```

Defined in: [validation.public.ts:611](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L611)

## Type Parameters

### TFieldError

`TFieldError`
