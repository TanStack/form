---
id: debugging
title: Debugging React Usage
---

This page covers common React and TypeScript problems when using TanStack Form.

## An input changes from uncontrolled to controlled

Every value rendered by a controlled input must exist in form-level
`defaultValues` from the first render.

```tsx
const form = useForm({
  defaultValues: {
    firstName: '',
    subscribed: false,
  },
})
```

Do not omit `defaultValues` or rely on a field-level default. When values come
from an API, render a loading state before mounting the editable form or supply
a complete fallback shape.

## A field value is `unknown`

Field names and values are inferred from `defaultValues`. Check that you have
not widened the initial object to `Record<string, unknown>`, `any`, or an
unrelated union. Prefer a concrete value type:

```tsx
type Profile = { firstName: string; age: number }

const defaults: Profile = { firstName: '', age: 0 }
const form = useForm({ defaultValues: defaults })
```

For extremely large forms, split UI into typed components or scoped form/field
groups instead of casting each field value.

## Type instantiation is excessively deep

This TypeScript error usually involves a very large recursive value shape, a
widely inferred union, or an unsupported composition. Reduce it to the smallest
form that reproduces the problem, keep `defaultValues` concrete, and avoid
unnecessary generic wrappers.

If the minimal reproduction still fails, report it in the
[TanStack Form issue tracker](https://github.com/TanStack/form/issues). Include
the TypeScript version, the form value type, and the smallest failing field.

## Errors exist but are not displayed

`field.errors` respects the form's `errorVisibility` policy. Inspect
`field.meta.original.errors` when debugging whether validation ran but the
issues are intentionally hidden. Also confirm that the input calls
`field.handleBlur` if the policy depends on `isBlurred`.
