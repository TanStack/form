---
id: getting-and-setting-values
title: Getting and Setting Form Values
---

This guide covers the different ways to read and write form values in TanStack Form—both at initialization time and at runtime.

## Setting initial values

The simplest way to populate a form is by passing `defaultValues` to `useForm`:

```tsx
const form = useForm({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
  },
  onSubmit: async ({ value }) => {
    console.log(value)
  },
})
```

You can also share defaults across multiple forms using `formOptions`:

```tsx
import { formOptions, useForm } from '@tanstack/react-form'

const sharedOptions = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
})

// Later, in a component:
const form = useForm({
  ...sharedOptions,
  onSubmit: async ({ value }) => console.log(value),
})
```

## Initializing with async / API data

When your default values come from a server, you have two main options.

### Without TanStack Query

You can fetch the data yourself and pass it to `defaultValues` once it is ready. Until then, render a loading state:

```tsx
export default function App() {
  const [initialData, setInitialData] = React.useState<{
    firstName: string
    lastName: string
  } | null>(null)

  React.useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((data) => setInitialData(data))
  }, [])

  if (!initialData) return <p>Loading…</p>

  return <UserForm initialData={initialData} />
}

function UserForm({
  initialData,
}: {
  initialData: { firstName: string; lastName: string }
}) {
  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => console.log(value),
  })
  // …render the form
}
```

> **Tip:** Always render the form *after* the data is ready so `defaultValues` is only evaluated once. Changing `defaultValues` after the form mounts has no effect.

### With TanStack Query

[TanStack Query](https://tanstack.com/query) pairs perfectly with TanStack Form for async defaults. See the dedicated [Async Initial Values](./async-initial-values.md) guide for a complete example.

```tsx
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then((r) => r.json()),
  })

  if (isLoading) return <p>Loading…</p>

  return <UserForm defaultValues={data} />
}
```

## Getting field values

### Inside a field's render prop

Within a `form.Field` render, the current value is available on `field.state.value`:

```tsx
<form.Field name="firstName">
  {(field) => (
    <input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
    />
  )}
</form.Field>
```

### Imperatively (non-reactive)

Call `form.getFieldValue(fieldName)` anywhere outside a render prop to read the **current snapshot** of a field value. This does **not** subscribe to future updates:

```tsx
const currentName = form.getFieldValue('firstName')
```

To read the entire form state at once, access `form.state.values`:

```tsx
const allValues = form.state.values
```

### Reactively

If you need a value that **re-renders your component** when it changes, use `useStore` from the store package:

```tsx
import { useStore } from '@tanstack/react-store'

const firstName = useStore(form.store, (state) => state.values.firstName)
```

To keep re-renders scoped to a sub-tree of your UI rather than the full component, use the `form.Subscribe` component:

```tsx
<form.Subscribe selector={(state) => state.values.age}>
  {(age) => <p>You are {age} years old.</p>}
</form.Subscribe>
```

> See the [Reactivity](./reactivity.md) guide for a deeper dive into `useStore` vs `form.Subscribe`.

## Setting field values programmatically

### Setting a single field

Use `form.setFieldValue` to update one field from outside a render prop—for example in response to a button click or an external event:

```tsx
// Set a scalar value
form.setFieldValue('firstName', 'Jane')

// Use an updater function for derived updates
form.setFieldValue('age', (prev) => prev + 1)
```

Inside a field's render prop, prefer `field.setValue` (or `field.handleChange`) instead:

```tsx
<form.Field name="firstName">
  {(field) => (
    <button onClick={() => field.setValue('Jane')}>Set name to Jane</button>
  )}
</form.Field>
```

### Resetting the form to new values

To replace **all** field values at once (and optionally update the stored default values), call `form.reset`:

```tsx
// Reset to completely new values
form.reset({
  firstName: 'Jane',
  lastName: 'Smith',
  age: 25,
})
```

`form.reset` also re-initialises the form's "dirty" and "touched" tracking, making it ideal for switching between records in a master/detail view.

### Setting values across multiple fields individually

If you need to set several fields without resetting the form state, call `setFieldValue` multiple times:

```tsx
form.setFieldValue('firstName', 'Jane')
form.setFieldValue('lastName', 'Smith')
```

## Programmatic updates and validation

By default, calling `form.setFieldValue` or `field.setValue` **does** run the field's change-event validators (the same validators that run when the user types). This is equivalent to how the value changes when a user interacts with the input.

### Skipping validation

To update a value without triggering validation, pass `{ dontValidate: true }` in the options:

```tsx
form.setFieldValue('firstName', 'Jane', { dontValidate: true })
```

### Triggering validation manually

To run validation on a field without changing its value, call `form.validateField`:

```tsx
// Validate as if the field just changed
await form.validateField('firstName', 'change')

// Validate as if the field was blurred
await form.validateField('firstName', 'blur')
```

### Marking a field as touched when setting its value

Validators often only run after a field has been touched. If you set a value programmatically and also want to mark the field as touched (so error messages appear), call `field.setMeta` alongside the value update:

```tsx
<form.Field name="firstName">
  {(field) => (
    <button
      onClick={() => {
        field.setValue('Jane')
        field.setMeta((prev) => ({ ...prev, isTouched: true }))
      }}
    >
      Set and touch
    </button>
  )}
</form.Field>
```

## Listening for value changes

For **side effects** that should fire when a field changes (e.g. resetting a dependent field), use the listeners API:

```tsx
<form.Field
  name="country"
  listeners={{
    onChange: ({ value }) => {
      form.setFieldValue('province', '')
    },
  }}
>
  {(field) => <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />}
</form.Field>
```

> See the [Side effects for event triggers](./listeners.md) guide for more detail, including built-in debouncing and form-level listeners.
