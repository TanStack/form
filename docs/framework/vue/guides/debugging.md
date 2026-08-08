---
id: debugging
title: Debugging Vue Usage
---

This page covers common Vue and TypeScript problems when using TanStack Form.

## An input initially renders `undefined`

Every value rendered by an input must exist in form-level `defaultValues` from
the first render.

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    firstName: '',
    subscribed: false,
  },
})
</script>
```

Do not omit `defaultValues` or rely on a field-level default. When values come
from an API, render a loading state before mounting the editable form or supply
a complete fallback shape.

## A field value is `unknown`

Field names and values are inferred from `defaultValues`. Check that you have
not widened the initial object to `Record<string, unknown>`, `any`, or an
unrelated union. Prefer a concrete value type:

```ts
type Profile = { firstName: string; age: number }

const defaults: Profile = { firstName: '', age: 0 }
const form = useForm({ defaultValues: defaults })
```

For extremely large forms, split UI into typed components or scoped form and
field groups instead of casting each field value.

## Async defaults do not update

The Vue adapter observes reactive option objects. If data arrives after
`useForm` runs, update `defaultValues` through a `reactive` options object or
mount the editor only after the data exists. A plain object containing a
one-time snapshot is not reactive.

## Composition types fail under Vue 3.5

Form v2 requires Vue 3.6 or newer. The adapter's typed field components,
injection-based `AppForm`, and form composition rely on Vue 3.6 behavior that
is not available in Vue 3.5.

## Type instantiation is excessively deep

This TypeScript error usually involves a very large recursive value shape, a
widely inferred union, or unsupported composition. Reduce it to the smallest
form that reproduces the problem, keep `defaultValues` concrete, and avoid
unnecessary generic wrappers.

If the minimal reproduction still fails, report it in the
[TanStack Form issue tracker](https://github.com/TanStack/form/issues). Include
the Vue and TypeScript versions, the form value type, and the smallest failing
field.

## Errors exist but are not displayed

`field.errors` respects the form's `errorVisibility` policy. Inspect
`field.meta.original.errors` when debugging whether validation ran but the
issues are intentionally hidden. Also confirm that the input calls
`field.handleBlur` if the policy depends on `isBlurred`.
