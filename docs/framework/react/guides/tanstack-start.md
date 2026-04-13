---
id: tanstack-start
title: TanStack Form - TanStack Start
---

## Using TanStack Form in TanStack Start

> Before reading this section, it's suggested you understand how TanStack `serverFunctions`. [Check out TanStack docs for more information](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)

### TanStack Start Prerequisites

- Start a new `TanStack Start` project, following the steps in the [TanStack Start Quickstart Guide](https://tanstack.com/router/latest/docs/framework/react/guide/tanstack-start)
- Install `@tanstack/react-form-start`
- Install any [form validator](./validation#validation-through-schema-libraries) of your choice. [Optional]

### Start integration

Let's start by creating a `formOption` that we'll use to share the form's shape across the client and server.

```tsx app/routes/index.tsx
import { formOptions } from '@tanstack/react-form-start'

// You can pass other form options here
export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
})
```

Next, we can create [a Start Server Function](https://tanstack.com/start/latest/docs/framework/react/server-functions) that will handle the form submission on the server.

```tsx app/routes/index.tsx
import {
  createServerValidate,
  ServerValidateError,
} from '@tanstack/react-form-start'

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export const handleForm = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    try {
      const validatedData = await serverValidate(ctx.data)
      console.log('validatedData', validatedData)
      // Persist the form data to the database
      // await sql`
      //   INSERT INTO users (name, email, password)
      //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
      // `
    } catch (e) {
      if (e instanceof ServerValidateError) {
        // Log form errors or do any other logic here
        return e.response
      }

      // Some other error occurred when parsing the form
      console.error(e)
      setResponseStatus(500)
      return 'There was an internal error'
    }

    return 'Form has validated successfully'
  })
```

Then we need to establish a way to grab the form data from `serverValidate`'s `response` using another server action:

```tsx app/routes/index.tsx
import { getFormData } from '@tanstack/react-form-start'

export const getFormDataFromServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getFormData()
  },
)
```

Finally, we'll use `getFormDataFromServer` in our loader to get the state from our server into our client and `handleForm` in our client-side form component.

```tsx app/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from '@tanstack/react-form-start'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => ({
    state: await getFormDataFromServer(),
  }),
})

function Home() {
  const { state } = Route.useLoaderData()
  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  })

  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form action={handleForm.url} method="post" encType={'multipart/form-data'}>
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
                name={field.name}
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
  transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
})
```
