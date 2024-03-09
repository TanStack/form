---
id: ui-libraries
title: UI Libraries
---

# Usage of TanStack Form with UI Libraries

TanStack Form is a headless library, offering you complete flexibility to style it as you see fit. It's compatible with a wide range of UI libraries, including `Tailwind`, `Material UI`, `Mantine`, or even plain CSS.

This guide focuses on `Material UI` and `Mantine`, but the concepts are applicable to any UI library of your choice.

## Prerequisites

Before integrating TanStack Form with a UI library, ensure the necessary dependencies are installed in your project:

- For `Material UI`, follow the installation instructions on their [official site](https://mui.com/material-ui/getting-started/).
- For `Mantine`, refer to their [documentation](https://mantine.dev/).

Note: While you can mix and match libraries, it's generally advisable to stick with one to maintain consistency and minimize bloat.

## Example with Mantine

Here's an example demonstrating the integration of TanStack Form with Mantine components:

```tsx
import { TextInput, Checkbox } from '@mantine/core'
import { useForm } from '@tanstack/react-form'

export default function App() {
  const { Field, handleSubmit, state } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      isChecked: false,
    },
    onSubmit: async ({ value }) => {
      // Handle form submission
      console.log(value)
    },
  })

  return (
    <>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Field
            name="firstName"
            children={({ state, handleChange, handleBlur }) => (
              <TextInput
                defaultValue={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter your name"
              />
            )}
          />
          <Field
            name="isChecked"
            children={({ state, handleChange, handleBlur }) => (
              <Checkbox
                onChange={(e) => handleChange(e.target.checked)}
                onBlur={handleBlur}
                checked={state.value}
              />
            )}
          />
        </form>
      <div>
        <pre>{JSON.stringify(state.values, null, 2)}</pre>
      </div>
    </>
  )
}
```

- Initially, we utilize the `useForm` hook from TanStack and destructure the necessary properties. This step is optional; alternatively, you could use `const form = useForm()` if preferred. TypeScript's type inference ensures a smooth experience regardless of the approach.
- The `Field` component, derived from `useForm`, accepts several properties, such as `validators`. For this demonstration, we focus on two primary properties: `name` and `children`.
  - The `name` property identifies each `Field`, for instance, `firstName` in our example.
  - The `children` property leverages the concept of render props, allowing us to integrate components without unnecessary abstractions.
- TanStack's design relies heavily on render props, providing access to `children` within the `Field` component. This approach is entirely type-safe. When integrating with Mantine components, such as `TextInput`, we selectively destructure properties like `state.value`, `handleChange`, and `handleBlur`. This selective approach is due to the slight differences in types between `TextInput` and the `field` we get in the children.
- By following these steps, you can seamlessly integrate Mantine components with TanStack Form.
- This methodology is equally applicable to other components, such as `Checkbox`, ensuring consistent integration across different UI elements.

## Usage with Material UI

The process for integrating Material UI components is similar. Here's an example using TextField and Checkbox from Material UI:

```tsx
        <Field
            name="lastName"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <TextField
                  id="filled-basic"
                  label="Filled"
                  variant="filled"
                  defaultValue={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Enter your last name"
                />
              );
            }}
          />

           <Field
            name="isMuiCheckBox"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <MuiCheckbox
                  onChange={(e) => handleChange(e.target.checked)}
                  onBlur={handleBlur}
                  checked={state.value}
                />
              );
            }}
          />

```

- The integration approach is the same as with Mantine.
- The primary difference lies in the specific Material UI component properties and styling options.
