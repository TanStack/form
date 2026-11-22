---
id: FormGroupValidationError
title: FormGroupValidationError
---

```ts
type FormGroupValidationError<TGroupValue> = 
  | ValidationErrorInput
| ValidationErrorMap<TGroupValue, ValidationErrorInput, ValidationErrorInput>;
```

Defined in: [validation/results/results.public.ts:177](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L177)

Errors for a form group, optionally including errors at group-relative field paths.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.
