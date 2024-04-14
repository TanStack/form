---
id: debugging
title: Debugging React Usage
---

Here's a list of common errors you might see in the console and how to fix them.

# Changing an uncontrolled input to be controlled

If you see this error in the console:

```
Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
```

It's likely you forgot the `defaultValues` in your `useForm` Hook or `form.Field` component usage. This is occurring
because the input is being rendered before the form value is initialized and is therefore changing from `undefined` to `""` when a text input is made.

# Changing a controlled input to uncontrolled

If you see this error in the console:

```
Warning: A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
```

The `form.Field` likely got temporarily unmounted, for example, through tabs or other interface components that only
show parts of the form.

This warning is occurring because TanStack Form cleans up form fields on unmount. To resolve this issue, consider
preserving the form field's value on unmount through the `preserveValue` prop on `form.Field`. Example:

```tsx
<form.Field name="name" preserveValue>
  {(field) => (
    <label>
      <div>Name</div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  )}
</form.Field>
```
