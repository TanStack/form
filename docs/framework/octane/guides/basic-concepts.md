---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/octane-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library.

## Form Options

You can customize your form by creating configuration options with the `formOptions` function. These options can be shared between multiple forms.

Example:

```ts
import { formOptions } from '@tanstack/octane-form'

interface User {
  firstName: string
  lastName: string
  hobbies: Array<{
    name: string
    description: string
    yearsOfExperience: number
  }>
}
const defaultUser: User = { firstName: '', lastName: '', hobbies: [] }

const formOpts = formOptions({
  defaultValues: defaultUser,
})
```

## Form Instance

A Form instance is an object that represents an individual form and provides methods and properties for working with the form. You create a Form instance using the `useForm` hook from `@tanstack/octane-form` inside an Octane component. The hook accepts an object with an `onSubmit` function, which is called when the form is submitted.

```ts
const form = useForm({
  ...formOpts,
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
})
```

You may also create a Form instance without using `formOptions` by using the standalone `useForm` API:

```ts
interface User {
  firstName: string
  lastName: string
  hobbies: Array<{
    name: string
    description: string
    yearsOfExperience: number
  }>
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

A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the `form.Field` component provided by the Form instance. The component accepts a `name` prop, which should match a key in the form's default values. It also accepts a `children` prop, which is a render prop function that takes a `field` object as its argument.

Example:

```tsrx
<form.Field
  name="firstName"
  children={(field) => <>
    <input
      value={field.state.value}
      onBlur={field.handleBlur}
      onInput={(e) => field.handleChange(e.currentTarget.value)}
    />
    <FieldInfo field={field} />
  </>}
/>
```

In TSRX, pass function children explicitly with `children={...}`. Save rendering code in `.tsrx` files and compile it with the Octane Vite plugin described in the [Quick Start](../quick-start.md).

Octane uses native DOM events. Use `onInput` for per-keystroke text updates, read the input through `event.currentTarget`, and pass its value to `field.handleChange`. `onChange` follows the browser's commit behavior.

You can show metadata in a reusable component:

```tsrx
import type { AnyFieldApi } from '@tanstack/octane-form'

function FieldInfo({ field }: { field: AnyFieldApi }) @{
  <>
    @if (field.state.meta.isTouched && !field.state.meta.isValid) {
      <em>{field.state.meta.errors.join(', ')}</em>
    }
    @if (field.state.meta.isValidating) {
      <span>Validating...</span>
    }
  </>
}
```

## Field State

Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the `field.state` property.

Example:

```ts
const {
  value,
  meta: { errors, isValidating },
} = field.state
```

There are five states in the metadata that can be useful for seeing how the user interacts with a field:

- **isTouched**: is `true` once the user changes or blurs the field
- **isDirty**: is `true` once the field's value is changed, even if it's reverted to the default. Opposite of `isPristine`
- **isPristine**: is `true` until the user changes the field's value. Opposite of `isDirty`
- **isBlurred**: is `true` once the field loses focus (is blurred)
- **isDefaultValue**: is `true` when the field's current value is the default value

```ts
const { isTouched, isDirty, isPristine, isBlurred } = field.state.meta
```

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

## Understanding 'isDirty' in Different Libraries

Non-Persistent `dirty` state

- **Libraries**: React Hook Form (RHF), Formik, Final Form.
- **Behavior**: A field is 'dirty' if its value differs from the default. Reverting to the default value makes it 'clean' again.

Persistent `dirty` state

- **Libraries**: Angular Form, Vue FormKit.
- **Behavior**: A field remains 'dirty' once changed, even if reverted to the default value.

We have chosen the persistent 'dirty' state model. However, we have introduced the `isDefaultValue` flag to also support a non-persistent 'dirty' state.

```ts
const { isDefaultValue, isTouched } = field.state.meta

// The following line will re-create the non-persistent `dirty` functionality.
const nonPersistentIsDirty = !isDefaultValue
```

![Field states extended](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states-extended.png)

## Field API

The Field API is an object passed to the render prop function when creating a field. It provides methods for working with the field's state.

Example:

```tsrx
<input
  value={field.state.value}
  onBlur={field.handleBlur}
  onInput={(e) => field.handleChange(e.currentTarget.value)}
/>
```

## Validation

`@tanstack/octane-form` provides both synchronous and asynchronous validation out of the box. Validation functions can be passed to the `form.Field` component using the `validators` prop.

Example:

```tsrx
<form.Field
  name="firstName"
  validators={{
    onChange: ({ value }) => !value
      ? 'A first name is required'
      : value.length < 3
        ? 'First name must be at least 3 characters'
        : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value.includes('error') && 'No "error" allowed in first name'
    },
  }}
  children={(field) => <>
    <input
      value={field.state.value}
      onBlur={field.handleBlur}
      onInput={(e) => field.handleChange(e.currentTarget.value)}
    />
    <FieldInfo field={field} />
  </>}
/>
```

## Validation with Standard Schema Libraries

In addition to hand-rolled validation options, we also support the [Standard Schema](https://github.com/standard-schema/standard-schema) specification.

You can define a schema using any of the libraries implementing the specification and pass it to a form or field validator.

Supported libraries include:

- [Zod](https://zod.dev/) (v3.24.0 or higher)
- [Valibot](https://valibot.dev/) (v1.0.0 or higher)
- [ArkType](https://arktype.io/) (v2.1.20 or higher)
- [Yup](https://github.com/jquense/yup) (v1.7.0 or higher)

```tsrx
import { useForm } from '@tanstack/octane-form'
import { z } from 'zod'

const userSchema = z.object({
  age: z.number().gte(13, 'You must be 13 to make an account'),
})

function App() @{
  const form = useForm({
    defaultValues: { age: 0 },
    validators: { onChange: userSchema },
  })

  <form.Field
    name="age"
    children={(field) =>
      <input
        type="number"
        value={field.state.value}
        onBlur={field.handleBlur}
        onInput={(event) => field.handleChange(
          event.currentTarget.valueAsNumber,
        )}
      />}
  />
}
```

## Reactivity

`@tanstack/octane-form` offers various ways to subscribe to form and field state changes, most notably the `useSelector(form.store, …)` hook and the `form.Subscribe` component. These methods allow you to optimize your form's rendering performance by only updating components when necessary.

Example (inside a component):

```tsrx
import { useSelector } from '@tanstack/octane-form'

const firstName = useSelector(form.store, (state) => state.values.firstName)

const submitButton = <form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
  children={([canSubmit, isSubmitting]) => <button
    type="submit"
    disabled={!canSubmit}
  >
    {isSubmitting ? '...' : 'Submit'}
  </button>}
/>
```

It is important to remember that while the `useSelector` hook's `selector` prop is optional, it is strongly recommended to provide one, so that updates to unrelated form state do not update the component.

```ts
// Subscribe to the values you use
const firstName = useSelector(form.store, (state) => state.values.firstName)
const errors = useSelector(form.store, (state) => state.errorMap)
// Subscribe to the entire state only when you need it
const state = useSelector(form.store)
```

The `form.Field` component already subscribes to its field state. For form state outside a field, use `useSelector` or `form.Subscribe`; reading `form.state` alone does not subscribe an Octane component. See [Reactivity](./reactivity.md) for more details.

## Listeners

`@tanstack/octane-form` allows you to react to specific triggers and "listen" to them to dispatch side effects.

Example:

```tsrx
<form.Field
  name="country"
  listeners={{
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value}, resetting province`)
      form.setFieldValue('province', '')
    },
  }}
  children={(field) =>
    <input
      value={field.state.value}
      onBlur={field.handleBlur}
      onInput={(event) => field.handleChange(event.currentTarget.value)}
    />}
/>
```

More information can be found at [Listeners](./listeners.md)

## Array Fields

Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the `form.Field` component with the `mode="array"` prop.

When working with array fields, you can use the `pushValue`, `removeValue`, `swapValues`, and `moveValue` methods to add, remove, swap, and move a value from one index to another within the array, respectively. Additional helper methods such as `insertValue`, `replaceValue`, and `clearValues` are also available for inserting, replacing, and clearing array values.

Example:

```tsrx
<form.Field
  name="hobbies"
  mode="array"
  children={(hobbiesField) => <div>
    <h2>Hobbies</h2>
    @for (const hobby of hobbiesField.state.value; index i; key i) {
      <div>
        <form.Field
          name={`hobbies[${i}].name`}
          children={(field) => <div>
            <label htmlFor={field.name}>Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onInput={(event) => field.handleChange(event.currentTarget.value)}
            />
            <FieldInfo field={field} />
          </div>}
        />
        <form.Field
          name={`hobbies[${i}].description`}
          children={(field) => <div>
            <label htmlFor={field.name}>Description:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onInput={(event) => field.handleChange(event.currentTarget.value)}
            />
            <FieldInfo field={field} />
          </div>}
        />
        <button type="button" onClick={() => hobbiesField.removeValue(i)}>
          Remove hobby
        </button>
      </div>
    } @empty {
      <p>No hobbies found.</p>
    }
    <button
      type="button"
      onClick={() => hobbiesField.pushValue({
        name: '',
        description: '',
        yearsOfExperience: 0,
      })}
    >
      Add hobby
    </button>
  </div>}
/>
```

Use TSRX's keyed `@for` directive to render lists. This example binds field paths to array indices. If rows contain their own local state and have stable identifiers, use those identifiers as keys. See [Arrays](./arrays.md) for more details.

## Reset Buttons

When using `<button type="reset">` with TanStack Form's `form.reset()`, you need to prevent the default HTML reset behavior to avoid unexpected resets of form elements (especially `<select>` elements) to their initial HTML values.
Use `event.preventDefault()` inside the button's `onClick` handler to prevent the native form reset.

Example:

```tsrx
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

```tsrx
<button
  type="button"
  onClick={() => {
    form.reset()
  }}
>
  Reset
</button>
```

These are the basic concepts and terminology used in the `@tanstack/octane-form` library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.
