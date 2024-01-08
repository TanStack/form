---
id: basic-concepts
title: Basic Concepts and Terminology
---

This page introduces the basic concepts and terminology used in the `@tanstack/react-form` library. Familiarizing yourself with these concepts will help you better understand and work with the library.

## Form Factory

The Form Factory is responsible for creating form instances with a shared configuration. It is created using the `createFormFactory` function, which accepts a configuration object with default values for the form fields. This shared configuration allows you to create multiple form instances with consistent behavior.

Example:

```tsx
const formFactory = createFormFactory<Person>({
  defaultValues: {
    firstName: '',
    lastName: '',
    hobbies: [],
  },
})
```

## Form Instance

A Form Instance is an object that represents an individual form and provides methods and properties for working with the form. You create a form instance using the useForm hook provided by the form factory. The hook accepts an object with an onSubmit function, which is called when the form is submitted.

```tsx
const form = formFactory.useForm({
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
const { value, error, touched, isValidating } = field.state
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
        ? "A first name is required"
        : value.length < 3
        ? "First name must be at least 3 characters"
        : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return (
        value.includes("error") &&
        'No "error" allowed in first name'
      );
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

## Validation Adapters

In addition to hand-rolled validation options, we also provide adapters like `@tanstack/zod-form-adapter`, `@tanstack/yup-form-adapter`, and `@tanstack/valibot-form-adapter` to enable usage with common schema validation tools like [Zod](https://zod.dev/), [Yup](https://github.com/jquense/yup), and [Valibot](https://valibot.dev/).

Example:

```tsx
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

// ...

<form.Field
  name="firstName"
  validatorAdapter={zodValidator}
  validators={{
    onChange: z
      .string()
      .min(3, "First name must be at least 3 characters"),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.string().refine(
      async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return !value.includes("error");
      },
      {
        message: "No 'error' allowed in first name",
      },
    ),
  }}
/>
```

## Reactivity

`@tanstack/react-form` offers various ways to subscribe to form and field state changes, such as the `form.useStore` hook, the `form.Subscribe` component, and the `form.useField` hook. These methods allow you to optimize your form's rendering performance by only updating components when necessary.

Example:

```tsx
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
  children={([canSubmit, isSubmitting]) => (
    <button type="submit" disabled={!canSubmit}>
      {isSubmitting ? '...' : 'Submit'}
    </button>
  )}
/>
```

## Array Fields

Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the `form.Field` component with the `mode="array"` prop. The component accepts a children prop, which is a render prop function that takes an `arrayField` object as its argument.

When working with array fields, you can use the fields `pushValue`, `removeValue`, and `swapValues` methods to add, remove, and swap values in the array.

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
                <hobbiesField.Field
                  index={i}
                  name="name"
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
                <hobbiesField.Field
                  index={i}
                  name="description"
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

## Array-Nested Fields

Rendering fields that are items of a nested array require only a small change to the `form.Field` component props.

Example:

```tsx
<hobbiesField.Field
  index={i}
  name="name"
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
        <button type="button" onClick={() => hobbiesField.removeValue(i)}>
          X
        </button>
        <FieldInfo field={field} />
      </div>
    )
  }}
/>
```

These are the basic concepts and terminology used in the `@tanstack/react-form` library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.

