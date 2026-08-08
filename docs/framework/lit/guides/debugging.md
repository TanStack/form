---
id: debugging
title: Debugging Lit Usage
---

This page covers common Lit and TypeScript problems when using TanStack Form.

## An input renders an empty or undefined value

Every value bound to an input must exist in form-level `defaultValues` from the
first render.

```ts
private form = new TanStackFormController(this, {
  defaultValues: {
    firstName: '',
    subscribed: false,
  },
})
```

Do not omit `defaultValues` or rely on a field-level default. When values come
from an API, render a loading state before creating the editable controller or
provide a complete fallback shape and call `form.update(...)` when data arrives.

## A field value is `unknown`

Field names and values are inferred from `defaultValues`. Check that the
initial object has not been widened to `Record<string, unknown>`, `any`, or an
unrelated union. Prefer a concrete value type:

```ts
type Profile = { firstName: string; age: number }

const defaults: Profile = { firstName: '', age: 0 }
const form = new TanStackFormController(this, { defaultValues: defaults })
```

For large forms, split rendering into functions typed with `LitFormType`, use a
scoped `form.formGroup(...)`, or build reusable virtual field bundles with
`getFieldGroupHelpers()` instead of casting each field value.

## Form state changed but the template did not update

Render field state inside `form.field(...)` and selected form state inside
`form.subscribe(...)`. These Lit directives update only their own child parts.
Reading `form.api.state` directly in `render()` does not subscribe that markup
to later changes.

```ts
this.form.subscribe(
  (state) => state.isSubmitting,
  (isSubmitting) => html` <button ?disabled=${isSubmitting}>Submit</button> `,
)
```

Both directives must be interpolated into a Lit child part. They cannot be used
as attribute directives.

## Type instantiation is excessively deep

This TypeScript error usually involves a very large recursive value shape, a
widely inferred union, or an unsupported generic wrapper. Reduce it to the
smallest form that reproduces the problem, keep `defaultValues` concrete, and
avoid unnecessary generic layers.

If the minimal reproduction still fails, report it in the
[TanStack Form issue tracker](https://github.com/TanStack/form/issues). Include
the TypeScript version, form value type, and smallest failing field.

## Errors exist but are not displayed

`field.errors` respects the form's `errorVisibility` policy. Inspect
`field.meta.original.errors` to determine whether validation ran but the issues
were intentionally hidden. Confirm that the input calls `field.handleBlur()` if
the policy depends on `isBlurred`.
