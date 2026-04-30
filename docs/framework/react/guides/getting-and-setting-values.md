---
id: getting-and-setting-values
title: Getting and Setting Field Values
---

When building forms with TanStack Form, you often need to read or update field values programmatically outside of the standard user input flow. There are several ways to retrieve or change values securely.

## Getting Field Values

There are a few ways to read the value of a field, depending on your context:

### 1. Using `form.getFieldValue`
If you have access to the `form` instance, you can retrieve the current value of any field synchronously using `form.getFieldValue(fieldName)`. This does not trigger a component re-render.

```tsx
const form = useForm({
  defaultValues: {
    age: 25,
  },
})

const checkAge = () => {
  const currentAge = form.getFieldValue('age')
  console.log('Current age is:', currentAge)
}
```

### 2. Using `form.state.values`
You can also access all form values at once via `form.state.values`. Since `useForm` is reactive in React, accessing `form.state.values` directly inside your component body means the component will re-render whenever *any* value in the form changes. 

If you only need a specific value and want to avoid unnecessary re-renders, it's recommended to subscribe to just the slice of state you need using `useStore`:

```tsx
import { useStore } from '@tanstack/react-form'

function AgeDisplay({ form }) {
  // Subscribes and re-renders only when 'age' changes
  const age = useStore(form.store, (state) => state.values.age)
  
  return <div>Age: {age}</div>
}
```

### 3. Inside a `<form.Field>`
When defining a field using the `<form.Field>` component, the current field value is provided directly via `field.state.value` inside the render prop.

```tsx
<form.Field name="age">
  {(field) => (
    <div>
      Current age: {field.state.value}
    </div>
  )}
</form.Field>
```

## Setting Field Values

To update a field's value programmatically, use `form.setFieldValue(fieldName, newValue)`.

```tsx
const form = useForm({
  defaultValues: {
    status: 'inactive',
  },
})

const activate = () => {
  // Programmatically update the 'status' field
  form.setFieldValue('status', 'active')
}

return (
  <button type="button" onClick={activate}>
    Set Status Active
  </button>
)
```

### Advanced Setting Options

The `setFieldValue` function optionally accepts an `options` object as its third argument. You can use this to control whether the field should be marked as "touched" or "dirty" when the value is updated.

```tsx
form.setFieldValue('status', 'active', {
  dontUpdateMeta: true, // Prevents updating dirty/touched state
})
```

## Listening for Changes

If you need to automatically set one field's value exactly when another field changes, you should look into the [Listener API](./listeners.md). Listeners allow you to subscribe to `onChange` events safely without triggering infinite render loops.
