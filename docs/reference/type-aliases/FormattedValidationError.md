---
id: FormattedValidationError
title: FormattedValidationError
---

```ts
type FormattedValidationError<TFormData> = 
  | ValidationIssue
| FormattedValidationErrorMap<TFormData>;
```

Defined in: [validation/results/results.public.ts:101](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L101)

One entry in the flat errors returned by validation or submission.
Field paths remain attached to errors supplied as an error map.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.
