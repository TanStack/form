---
id: debugging
title: Debugging Angular Usage
---

This page covers common Angular and TypeScript problems when using TanStack
Form.

## An input initially renders `undefined`

Every value rendered by an input must exist in form-level `defaultValues` from
the first render.

```ts
form = injectForm({
  defaultValues: {
    firstName: '',
    subscribed: false,
  },
})
```

Do not omit `defaultValues` or rely on a field-level default. When values come
from an API, render a loading state before mounting the editable fields or
supply a complete fallback shape.

## A field value is `unknown`

Field names and values are inferred from `defaultValues`. Check that you have
not widened the initial object to `Record<string, unknown>`, `any`, or an
unrelated union. Prefer a concrete value type:

```ts
type Profile = { firstName: string; age: number }

const defaults: Profile = { firstName: '', age: 0 }
form = injectForm({ defaultValues: defaults })
```

For extremely large forms, split UI into typed components or scoped form and
field groups instead of casting each field value.

## A child component rejects the form input

Use `formOptions` for reusable base options and derive the input type with
`AngularFormType`. This keeps the child compatible when the parent adds
`onSubmit`:

```ts
import { Component, input } from '@angular/core'
import { formOptions } from '@tanstack/angular-form'
import type { AngularFormType } from '@tanstack/angular-form'

export const profileFormOptions = formOptions({
  defaultValues: { firstName: '', age: 0 },
})

@Component({
  selector: 'app-profile-fields',
  standalone: true,
  template: `<!-- fields -->`,
})
export class ProfileFieldsComponent {
  form = input.required<AngularFormType<typeof profileFormOptions>>()
}
```

## Async defaults do not update

`injectForm` receives its initial options when the component is constructed.
When data arrives later, call `form.reset(nextValues)` deliberately, normally
inside an Angular `effect`, or resolve the data before constructing the form.
Guard against replacing edits the user has already made.

## `injectForm` reports a missing injection context

Call `injectForm`, `injectSelector`, and `injectField` in an Angular injection
context, such as a component field initializer or constructor. Do not call
them later from an event handler, subscription callback, or arbitrary utility
function.

## Type instantiation is excessively deep

This TypeScript error usually involves a very large recursive value shape, a
widely inferred union, or unsupported composition. Reduce it to the smallest
form that reproduces the problem, keep `defaultValues` concrete, and avoid
unnecessary generic wrappers.

If the minimal reproduction still fails, report it in the
[TanStack Form issue tracker](https://github.com/TanStack/form/issues). Include
the Angular and TypeScript versions, the form value type, and the smallest
failing field.

## Errors exist but are not displayed

`field.api.errors` respects the form's `errorVisibility` policy. Inspect
`field.api.meta.original.errors` when debugging whether validation ran but the
issues are intentionally hidden. Also confirm that the input calls
`field.api.handleBlur()` if the policy depends on `isBlurred`.
