---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/react-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library.

## Form Options

You can create options for your form so that it can be shared between multiple forms by using the `formOptions` function.

Example:

```tsx
interface User {
  firstName: string
  lastName: string
  hobbies: Array<string>
}
const defaultUser: User = { firstName: '', lastName: '', hobbies: [] }

const formOpts = formOptions({
  defaultValues: defaultUser,
})
```

## Form Instance

A Form Instance is an object that represents an individual form and provides methods and properties for working with the form. You create a form instance using the `useForm` hook provided by the form options. The hook accepts an object with an `onSubmit` function, which is called when the form is submitted.

```tsx
const form = useForm({
  ...formOpts,
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
})
```

You may also create a form instance without using `formOptions` by using the standalone `useForm` API:

```tsx
interface User {
  firstName: string
  lastName: string
  hobbies: Array<string>
}
const defaultUser: User = { firstName: '', lastName: '', hobbies: [] }

const form = useForm({
  defaultValues: defaultUser,
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
})
```

## Field

A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the form.Field component provided by the form instance. The component accepts a name prop, which should match a key in the form's default values. It also accepts a children prop, which is a render prop function that takes a field object as its argument.

Example:

```tsx
<form.Field
  name="firstName"
  children={(field) => (
    <>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </>
  )}
/>
```

## Field State

Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the `field.state` property.

Example:

```tsx
const {
  value,
  meta: { errors, isValidating },
} = field.state
```

There are four states in the metadata that can be useful to see how the user interacts with a field:

- _"isTouched"_, after the user changes the field or blurs the field
- _"isDirty"_, after the field's value has been changed, even if it's been reverted to the default. Opposite of _"isPristine"_
- _"isBlurred"_, after the field has been blurred (exited)
- _"isDefaultValue"_, whether the field's current value is the default value

There is also one additional derived state:

- _"isPristine"_, until the user changes the field value. Opposite of _"isDirty"_

```tsx
const { isTouched, isDirty, isBlurred, isDefaultValue, isPristine } = field.state.meta
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

## Understanding 'isDirty' in Different Libraries

Non-Persistent `dirty` state

- **Libraries**: React Hook Form (RHF), Formik, Final Form.
- **Behavior**: A field is 'dirty' if its value differs from the default. Reverting to the default value makes it 'clean' again.

Persistent `dirty` state

- **Libraries**: Angular Form, Vue FormKit.
- **Behavior**: A field remains 'dirty' once changed, even if reverted to the default value.

We have chosen the persistent 'dirty' state model. To also support a non-persistent 'dirty' state, we introduce the isDefault flag. This flag acts as an inverse of the non-persistent 'dirty' state.

```tsx
const { isTouched, isPristine, isDirty, isDefaultValue } = field.state.meta

// The following line will re-create the non-Persistent `dirty` functionality.
const nonPersistentIsDirty = !isDefaultValue
```

## Field API

The Field API is an object passed to the render prop function when creating a field. It provides methods for working with the field's state.

Example:

```tsx
<input
  value={field.state.value}
  onBlur={field.handleBlur}
  onChange={(e) => field.handleChange(e.target.value)}
/>
```

## Validation

`@tanstack/react-form` provides both synchronous and asynchronous validation out of the box. Validation functions can be passed to the `form.Field` component using the `validators` prop.

Example:

```tsx
<form.Field
  name="firstName"
  validators={{
    onChange: ({ value }) =>
      !value
        ? 'A first name is required'
        : value.length < 3
          ? 'First name must be at least 3 characters'
          : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value.includes('error') && 'No "error" allowed in first name'
    },
  }}
  children={(field) => (
    <>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </>
  )}
/>
```

## Validation with Standard Schema Libraries

In addition to hand-rolled validation options, we also support the [Standard Schema](https://github.com/standard-schema/standard-schema) specification.

You can define a schema using any of the libraries implementing the specification and pass it to a form or field validator.

Supported libraries include:

- [Zod](https://zod.dev/)
- [Valibot](https://valibot.dev/)
- [ArkType](https://arktype.io/)

```tsx
import { z } from 'zod'

const userSchema = z.object({
  age: z.number().gte(13, 'You must be 13 to make an account'),
})

function App() {
  const form = useForm({
    defaultValues: {
      age: 0,
    },
    validators: {
      onChange: userSchema,
    },
  })
  return (
    <div>
      <form.Field
        name="age"
        children={(field) => {
          return <>{/* ... */}</>
        }}
      />
    </div>
  )
}
```

## Reactivity

`@tanstack/react-form` offers various ways to subscribe to form and field state changes, most notably the `useStore(form.store)` hook and the `form.Subscribe` component. These methods allow you to optimize your form's rendering performance by only updating components when necessary.

Example:

```tsx
const firstName = useStore(form.store, (state) => state.values.firstName)
//...
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
  children={([canSubmit, isSubmitting]) => (
    <button type="submit" disabled={!canSubmit}>
      {isSubmitting ? '...' : 'Submit'}
    </button>
  )}
/>
```

It is important to remember that while the `useStore` hook's `selector` prop is optional, it is strongly recommended to provide one, as omitting it will result in unnecessary re-renders.

```tsx
// Correct use
const firstName = useStore(form.store, (state) => state.values.firstName)
const errors = useStore(form.store, (state) => state.errorMap)
// Incorrect use
const store = useStore(form.store)
```

Note: The usage of the `useField` hook to achieve reactivity is discouraged since it is designed to be used thoughtfully within the `form.Field` component. You might want to use `useStore(form.store)` instead.

## Listeners

`@tanstack/react-form` allows you to react to specific triggers and "listen" to them to dispatch side effects.

Example:

```tsx
<form.Field
  name="country"
  listeners={{
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value}, resetting province`)
      form.setFieldValue('province', '')
    },
  }}
/>
```

More information can be found at [Listeners](../listeners.md)

## Array Fields

Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the `form.Field` component with the `mode="array"` prop.

When working with array fields, you can use the fields `pushValue`, `removeValue`, `swapValues` and `moveValue` methods to add, remove, and swap values in the array.

Example:

```tsx
<form.Field
  name="hobbies"
  mode="array"
  children={(hobbiesField) => (
    <div>
      Hobbies
      <div>
        {!hobbiesField.state.value.length
          ? 'No hobbies found.'
          : hobbiesField.state.value.map((_, i) => (
              <div key={i}>
                <form.Field
                  name={`hobbies[${i}].name`}
                  children={(field) => {
                    return (
                      <div>
                        <label htmlFor={field.name}>Name:</label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => hobbiesField.removeValue(i)}
                        >
                          X
                        </button>
                        <FieldInfo field={field} />
                      </div>
                    )
                  }}
                />
                <form.Field
                  name={`hobbies[${i}].description`}
                  children={(field) => {
                    return (
                      <div>
                        <label htmlFor={field.name}>Description:</label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                      </div>
                    )
                  }}
                />
              </div>
            ))}
      </div>
      <button
        type="button"
        onClick={() =>
          hobbiesField.pushValue({
            name: '',
            description: '',
            yearsOfExperience: 0,
          })
        }
      >
        Add hobby
      </button>
    </div>
  )}
/>
```

## Reset Buttons

When using `<button type="reset">` in conjunction with TanStack Form's `form.reset()`, you need to prevent the default HTML reset behavior to avoid unexpected resets of form elements (especially `<select>` elements) to their initial HTML values.
Use `event.preventDefault()` inside the button's `onClick` handler to prevent the native form reset.

Example:

```tsx
<button
  type="reset"
  onClick={(event) => {
    event.preventDefault()
    form.reset()
  }}
>
  Reset
</button>
```

Alternatively, you can use `<button type="button">` to prevent the native HTML reset.

```tsx
<button
  type="button"
  onClick={() => {
    form.reset()
  }}
>
  Reset
</button>
```

These are the basic concepts and terminology used in the `@tanstack/react-form` library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.
