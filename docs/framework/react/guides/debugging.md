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
