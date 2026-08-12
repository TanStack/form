---
id: AnyFieldApi
title: AnyFieldApi
---

# Type Alias: AnyFieldApi

```ts
type AnyFieldApi = FieldApi<any, any, any, any, any>;
```

Defined in: [FieldApi/FieldApi.public.ts:74](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L74)

A field API whose field name, value, error, and owning form types are erased.

Use it for reusable helpers that only need members shared by every field,
such as a generic error display. Because value and update types are erased,
prefer `FieldWithValue<TFieldValue>` when a helper reads or changes a field
value.

## Example

```ts
function getFieldErrorText(field: AnyFieldApi) {
  if (field.meta.isValid) return ''

  return field.errors.map((error) => error.message).join(', ')
}
```
