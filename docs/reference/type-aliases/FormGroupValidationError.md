---
id: FormGroupValidationError
title: FormGroupValidationError
---

```ts
type FormGroupValidationError<TGroupValue> = 
  | ValidationErrorInput
| ValidationErrorMap<TGroupValue>;
```

Defined in: [validation.public.ts:893](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L893)

Errors for a form group, optionally including errors at group-relative field paths.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.
