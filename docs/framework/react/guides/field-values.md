---
id: field-values
title: Getting and Setting Field Values
---

TanStack Form gives you a few different ways to read and update field values — directly through the form API, through the field API, or reactively through the form store. This guide walks through the most common patterns.

## Initializing the Form

The simplest way to initialize a form with values is to pass `defaultValues` to `useForm`:

```tsx
import { useForm } from '@tanstack/react-form'

function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: {
        city: '',
        zip: '',
      },
      hobbies: [] as string[],
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  // ...
}
```

`defaultValues` also drives TanStack Form's type inference, so the object you pass here determines the shape available to `getFieldValue`, `setFieldValue`, and the rest of the API.

### Initializing with Values from an API

If your initial values come from an async source (such as an API), the recommended approach is to pair TanStack Form with [TanStack Query](https://tanstack.com/query) and only render the form once the data has loaded:

```tsx
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'

function EditUserForm({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  const form = useForm({
    defaultValues: {
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
    },
    onSubmit: async ({ value }) => {
      await updateUser(userId, value)
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    // ...
  )
}
```

See the [Async Initial Values](./async-initial-values.md) guide for more detail.

If you don't want to use TanStack Query, you can fetch the data yourself and pass it into `defaultValues` once it's ready — just make sure the form isn't rendered until the data is available, since `defaultValues` are only read on the first render.

## Getting Field Values

### From the Form API

You can read a single field's current value from anywhere you have access to the form instance:

```tsx
const firstName = form.getFieldValue('firstName')
```

`getFieldValue` is fully typed against `defaultValues`, so nested paths work out of the box:

```tsx
const city = form.getFieldValue('address.city')
const firstHobby = form.getFieldValue('hobbies[0]')
```

To get the entire form's current values, read from `form.state.values`:

```tsx
const allValues = form.state.values
```

> `form.state.values` is a snapshot. Reading it inside an event handler or effect is fine, but don't rely on it to re-render a component on change — use `form.useStore` or `form.Subscribe` for that (see below).

### From Inside a Field

When you're already inside a `form.Field` render prop, the field's current value is available as `field.state.value`:

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

From a field, you can also reach back to the form to read any other field's value — this is useful for cross-field validation:

```tsx
<form.Field
  name="confirm_password"
  validators={{
    onChangeListenTo: ['password'],
    onChange: ({ value, fieldApi }) => {
      if (value !== fieldApi.form.getFieldValue('password')) {
        return 'Passwords do not match'
      }
      return undefined
    },
  }}
>
  {/* ... */}
</form.Field>
```

### Reactively Subscribing to Values

If you want a component to re-render whenever a value changes, use `form.useStore` or `form.Subscribe` instead of reading `form.state.values` directly:

```tsx
// Re-renders whenever firstName changes
const firstName = form.useStore((state) => state.values.firstName)
```

```tsx
<form.Subscribe selector={(state) => state.values.firstName}>
  {(firstName) => <p>Hello, {firstName}!</p>}
</form.Subscribe>
```

Both forms accept a selector so you can subscribe to as much or as little of the form state as you need — this keeps renders scoped and avoids re-rendering the entire form on every keystroke.

## Setting Field Values

### Setting a Single Field

Use `form.setFieldValue` to programmatically update a field:

```tsx
form.setFieldValue('firstName', 'Alice')
```

You can also pass an updater function, which receives the previous value:

```tsx
form.setFieldValue('hobbies', (prev) => [...prev, 'reading'])
```

Nested paths work the same way:

```tsx
form.setFieldValue('address.city', 'Seattle')
form.setFieldValue('hobbies[0]', 'climbing')
```

From within a field, you can update the field's own value with `field.handleChange` (the typical input path) or `field.setValue`:

```tsx
<form.Field name="firstName">
  {(field) => (
    <>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <button type="button" onClick={() => field.setValue('')}>
        Clear
      </button>
    </>
  )}
</form.Field>
```

### Setting Many Fields at Once

There is no single `setValues` call that replaces the entire form state, but you can batch multiple updates together so they only trigger a single render:

```tsx
import { useForm } from '@tanstack/react-form'

// ...

function fillFromApi(user: { firstName: string; lastName: string }) {
  form.setFieldValue('firstName', user.firstName)
  form.setFieldValue('lastName', user.lastName)
}
```

If you need to reset the form back to its initial state — or replace it with a brand new set of values — use `form.reset`:

```tsx
// Reset to the original defaultValues
form.reset()

// Reset to a new set of values
form.reset({
  firstName: 'Alice',
  lastName: 'Doe',
  address: { city: 'Seattle', zip: '98101' },
  hobbies: ['reading'],
})
```

### Will `setFieldValue` Trigger Validation?

Yes. By default, calling `setFieldValue` marks the field as touched and dirty and runs its `onChange` validators, exactly as if the user had typed the value themselves.

If you want to update a value _without_ running validation or touching the field's meta, pass the options bag:

```tsx
form.setFieldValue('firstName', 'Alice', {
  dontUpdateMeta: true, // leave isTouched/isDirty alone
  dontValidate: true, // skip onChange validation
})
```

You can later trigger validation manually with `form.validateField`:

```tsx
await form.validateField('firstName', 'change')
```

## Working with Arrays

Array fields come with dedicated helpers on the form (and on the field API) so you don't have to rebuild the array yourself:

```tsx
// Append an item
form.pushFieldValue('hobbies', 'climbing')

// Insert at a specific index
form.insertFieldValue('hobbies', 1, 'cooking')

// Replace an item
form.replaceFieldValue('hobbies', 0, 'reading')

// Remove by index
form.removeFieldValue('hobbies', 0)

// Swap two items
form.swapFieldValues('hobbies', 0, 1)

// Move an item from one index to another
form.moveFieldValues('hobbies', 0, 2)
```

Inside a `form.Field` rendered in `mode="array"`, the same helpers are available on the field itself:

```tsx
<form.Field name="hobbies" mode="array">
  {(field) => (
    <div>
      {field.state.value.map((_, i) => (
        <form.Field key={i} name={`hobbies[${i}]`}>
          {(subField) => (
            <input
              value={subField.state.value}
              onChange={(e) => subField.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      ))}
      <button type="button" onClick={() => field.pushValue('')}>
        Add hobby
      </button>
    </div>
  )}
</form.Field>
```

See the [Arrays](./arrays.md) guide for a full walkthrough of array fields, including arrays of objects.

## Listening for Value Changes

If you need to react to a value change — for example to clear a dependent field when the country changes — you have a few options.

### `listeners` on a field

The lightest-weight option is the field-level `listeners` prop:

```tsx
<form.Field
  name="country"
  listeners={{
    onChange: ({ value }) => {
      console.log('country changed to', value)
      form.setFieldValue('province', '')
    },
  }}
>
  {/* ... */}
</form.Field>
```

See the [Listeners](./listeners.md) guide for more on `onChange`, `onBlur`, and debounced variants.

### Subscribing from outside the field

If you want to react to changes from somewhere that doesn't own the field, subscribe through the form store:

```tsx
const country = form.useStore((state) => state.values.country)

useEffect(() => {
  // runs whenever `country` changes
}, [country])
```

This pairs well with `form.Subscribe` when the reaction is purely visual and doesn't need to live inside an effect.

---

With these pieces — `defaultValues`, `getFieldValue`/`state.values`, `setFieldValue`, the array helpers, and the subscription APIs — you have everything you need to read and manipulate form state from anywhere in your app.
