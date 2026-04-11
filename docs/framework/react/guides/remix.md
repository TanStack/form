---
id: ssr
title: TanStack Form - Remix
---

## Using TanStack Form in Remix

> Before reading this section, it's suggested you understand how Remix actions work. [Check out Remix's docs for more information](https://remix.run/docs/en/main/discussion/data-flow#route-action)

### Remix Prerequisites

- Start a new `Remix` project, following the steps in the [Remix Documentation](https://remix.run/docs/en/main/start/quickstart).
- Install `@tanstack/react-form`
- Install any [form validator](./validation#validation-through-schema-libraries) of your choice. [Optional]

## Remix integration

Let's start by creating a `formOption` that we'll use to share the form's shape across the client and server.

```tsx routes/_index/route.tsx
import { formOptions } from '@tanstack/react-form-remix'

// You can pass other form options here
export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
})
```

Next, we can create [an action](https://remix.run/docs/en/main/discussion/data-flow#route-action) that will handle the form submission on the server.

```tsx routes/_index/route.tsx
import {
  ServerValidateError,
  createServerValidate,
  formOptions,
} from '@tanstack/react-form-remix'

import type { ActionFunctionArgs } from '@remix-run/node'

// Create the server action that will infer the types of the form from `formOpts`
const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  try {
    const validatedData = await serverValidate(formData)
    console.log('validatedData', validatedData)
    // Persist the form data to the database
    // await sql`
    //   INSERT INTO users (name, email, password)
    //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
    // `
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }

    // Some other error occurred while validating your form
    throw e
  }

  // Your form has successfully validated!
}
```

Finally, the `action` will be called when the form submits.

```tsx
// routes/_index/route.tsx
import { Form, useActionData } from '@remix-run/react'
import { mergeForm, useForm, useStore } from '@tanstack/react-form'
import {
  ServerValidateError,
  createServerValidate,
  formOptions,
  initialFormState,
  useTransform,
} from '@tanstack/react-form-remix'

export default function Index() {
  const actionData = useActionData<typeof action>()

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? initialFormState),
      [actionData],
    ),
  })

  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form method="post" onSubmit={() => form.handleSubmit()}>
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}

      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            value < 8 ? 'Client validation: You must be at least 8' : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

### useTransform

you may have noticed util function `useTransform` being used throughout these examples, it's primary responsibility is the merging of the server and client state. Under the hood it is a useCallback whose deps are that of the server state, when the server state changes it will automatically patch the client state.

```tsx
const form = useForm({
  ...formOpts,
  transform: useTransform(
    (baseForm) => mergeForm(baseForm, actionData ?? initialFormState),
    [actionData],
  ),
})
```
