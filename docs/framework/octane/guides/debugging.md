---
id: debugging
title: Debugging Octane Usage
---

Here are common problems you may encounter when using TanStack Form with Octane and TSRX.

## Input values are undefined

Initialize every field in `defaultValues` or provide a field-level `defaultValue`. Otherwise an input can render before its value exists. Use `''` for an initially empty text input and a suitable value for number inputs, checkboxes, and arrays.

```ts
const form = useForm({
  defaultValues: {
    firstName: '',
    age: 0,
    acceptedTerms: false,
    hobbies: [] as Array<string>,
  },
})
```

For fetched data, see [Async Initial Values](./async-initial-values.md).

## Text values update only after blur

Octane uses native DOM events. `onChange` follows the browser's commit behavior; use `onInput` to update a text field after each edit.

```tsrx
<input
  value={field.state.value}
  onBlur={field.handleBlur}
  onInput={(event) => field.handleChange(event.currentTarget.value)}
/>
```

Read `event.currentTarget` to access the element handling the event. Pass its value to `field.handleChange`; passing the event itself would store the wrong value. TanStack Form's validator and listener names remain `onChange` even when the input uses `onInput`.

## Form state does not update in the template

Reading `form.state.values` alone does not create a subscription. Use `useSelector(form.store, selector)` or `form.Subscribe` for form state, and read field state inside `form.Field`'s render callback. See [Reactivity](./reactivity.md).

## TSRX syntax is rejected

Save templates in `.tsrx` files, configure the Octane Vite plugin, and use `tsrx-tsc` to check their types. The [Quick Start](../quick-start.md) covers the configuration.

When a component contains setup statements followed by rendered markup, use a statement container:

```tsrx
import { useForm } from '@tanstack/octane-form'

function App() @{
  const form = useForm({ defaultValues: { firstName: '' } })

  <form.Field
    name="firstName"
    children={(field) =>
      <input
        value={field.state.value}
        onInput={(event) => field.handleChange(event.currentTarget.value)}
      />}
  />
}
```

Pass render callbacks through `children={...}`. Use keyed `@for` directives for rendered lists, especially when they contain hooks or components that maintain local state.

## Field value is of type `unknown`

If `field.state.value` is inferred as `unknown`, check that the field name is part of your default values and that the form type is specific enough to evaluate. Very broad or deeply nested types can exceed what TypeScript can safely infer.

Prefer a smaller form or a more precise type. When you know the field's value type, a type assertion can be a temporary workaround:

```ts
const value = field.state.value as string
```

## `Type instantiation is excessively deep and possibly infinite`

This TypeScript diagnostic can occur when the form's generic types are too complex for the compiler to evaluate:

```text
Type instantiation is excessively deep and possibly infinite
```

Try reducing the type to a minimal reproduction. If the problem comes from TanStack Form's types, [report it on GitHub](https://github.com/TanStack/form/issues) with that reproduction.

This diagnostic describes a type-checking failure rather than a runtime exception. Resolve it before treating the form as type-safe; a running application alone does not verify its types.
