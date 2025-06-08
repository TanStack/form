---
id: submission-handling
title: Submission handling
---

## Error handling

When a user submits a form, there are several ways errors can occur — each requiring its own handling approach. TanStack Form gives you the flexibility to handle errors your way. To help you get started, here’s how to approach the three most common types of errors you’ll run into:

- **Synchronous user errors** – Issues you can catch right away, like a field being left empty or text that's too short.
- **Asynchronous user errors** – Issues that come up after submission, like finding out a username is already taken.
- **Server errors** – Unexpected problems on the backend, such as a failed request or an unknown error.

> [!TIP]
> If you need help understanding how validation works in TanStack Form, be sure to check out the [form validation](../validation.md) guide!

### Synchronous user errors

These are validation issues that can be detected immediately on the client side, even before the form is submitted. They are typically managed using both form-level and field-level validators, as shown in the example below:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}
>
  {() => <>{/* ... */}</>}
</form.Field>
```

### Asynchronous user errors

Asynchronous errors usually occur after the form is submitted, often due to external checks — like verifying whether a username or email is already taken. These kinds of errors can be handled using the async variants of form and field validators.

Since these requests are usually at form level, see how you can [set field-level errors from the form's validators](../validation.md).

```tsx
const form = createForm(() => ({
  // ...
  validators: {
    onSubmitAsync: async ({ value }) => {
      // Validate the value on the server
      const response = await createAccount(value)
      if (response.isError) {
        // Username is taken, return an error for the username field
        return 'Account is already taken!'
      }
      // The account creation was a success. There is no error that needs to be shown.
      return null
    },
  },
}))
```

### Server errors

Server errors are unexpected failures that happen during submission — like connectivity issues or internal server faults. These aren't related to user input and therefore **should not be part of form validation**.

These kinds of errors are typically handled by an external library, such as `TanStack Query`:

```tsx
// Using TanStack Query for data mutations
const createAccountMutation = useMutation(() => ({
  /* ... */
}))

const form = createForm(() => ({
  // ...
  onSubmit: async ({ value }) => {
    // If an error happens, they are accessible through
    // `createAccountMutation.error`
    await createAccountMutation.mutateAsync(value)
  },
}))
```

## Passing additional data to submission handling

You may have multiple types of submission behaviour, for example, going back to another page or staying on the form.
You can accomplish this by specifying the `onSubmitMeta` property. This meta data will be passed to the `onSubmit` function.

> Note: if `form.handleSubmit()` is called without metadata, it will use the provided default.

```tsx
import { createForm } from '@tanstack/solid-form'

type FormMeta = {
  submitAction: 'continue' | 'backToMenu' | null
}

// Metadata is not required to call form.handleSubmit().
// Specify what values to use as default if no meta is passed
const defaultMeta: FormMeta = {
  submitAction: null,
}

export default function App() {
  const form = createForm(() => ({
    defaultValues: {
      data: '',
    },
    // Define what meta values to expect on submission
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      // Do something with the values passed via handleSubmit
      console.log(`Selected action - ${meta.submitAction}`, value)
    },
  }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* ... */}
      <button
        type="submit"
        // Overwrites the default specified in onSubmitMeta
        onClick={() => form.handleSubmit({ submitAction: 'continue' })}
      >
        Submit and continue
      </button>
      <button
        type="submit"
        onClick={() => form.handleSubmit({ submitAction: 'backToMenu' })}
      >
        Submit and back to menu
      </button>
    </form>
  )
}
```

## Transforming data with Standard Schemas

While Tanstack Form provides [Standard Schema support](../validation.md) for validation, it does not preserve the Schema's output data.

The value passed to the `onSubmit` function will always be the input data. To receive the output data of a Standard Schema, parse it in the `onSubmit` function:

```tsx
import { createForm } from '@tanstack/solid-form'
import { z } from 'zod'

// ...

const schema = z.object({
  age: z.string().transform((age) => Number(age)),
})

// Tanstack Form uses the input type of Standard Schemas
const defaultValues: z.input<typeof schema> = {
  age: '13',
}

const form = createForm(() => ({
  defaultValues,
  validators: {
    onChange: schema,
  },
  onSubmit: ({ value }) => {
    const inputAge: string = value.age
    // Pass it through the schema to get the transformed value
    const result = schema.parse(value)
    const outputAge: number = result.age
  },
}))
```
