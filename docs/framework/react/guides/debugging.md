---
id: debugging
title: Debugging React Usage
---

Here's a list of common errors you might see in the console and how to fix them.

## Changing an uncontrolled input to be controlled

If you see this error in the console:

```
Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
```

It's likely you forgot the `defaultValues` in your `useForm` Hook or `form.Field` component usage. This is occurring
because the input is being rendered before the form value is initialized and is therefore changing from `undefined` to `""` when a text input is made.

## Field value is of type `unknown`

If you're using `form.Field` and, upon inspecting the value of `field.state.value`, you see that the value of a field is of type `unknown`, it's likely that your form's type was too large for us to safely evaluate.

This typically is a sign that you should break down your form into smaller forms or use a more specific type for your form.

A workaround to this problem is to cast `field.state.value` using TypeScript's `as` keyword:

```tsx
const value = field.state.value as string
```

## `Type instantiation is excessively deep and possibly infinite`

If you see this error in the console when running `tsc`:

```
Type instantiation is excessively deep and possibly infinite
```

You've run into a bug that we didn't catch in our type definitions. While we've done our best to make sure our types are as accurate as possible, there are some edge cases where TypeScript struggled with the complexity of our types.

Please [report this issue to us on GitHub](https://github.com/TanStack/form/issues) so we can fix it. Just make sure to include a minimal reproduction so that we're able to help you debug.

> Keep in mind that this error is a TypeScript error and not a runtime error. This means that your code will still run on the user's machine as expected.
