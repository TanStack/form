---
id: ssr
title: Next.js Usage
---

Before reading this guide, it's suggested you understand how React Server Components and React Server Actions work. [Check out this blog series for more information](https://unicorn-utterances.com/collections/react-beyond-the-render)

# Using TanStack Form in a Next.js App Router

TanStack Form is compatible with React out of the box, supporting `SSR` and being framework-agnostic. However, specific configurations are necessary, according to your chosen framework.

This guide focuses on integrating TanStack Form with `Next.js`, particularly using the `App Router` and `Server Actions`.

_We need help adding Remix support! [Come help us research and implement it here.](https://github.com/TanStack/form/issues/759)_

## Prerequisites

- Start a new `Next.js` project, following the steps in the [Next.js Documentation](https://nextjs.org/docs/getting-started/installation). Ensure you select `yes` for `Would you like to use App Router?` during the setup to access all new features provided by Next.js.
- Install `@tanstack/react-form`
- Install any [form validator](/form/latest/docs/framework/react/guides/validation#adapter-based-validation-zod-yup-valibot) of your choice. [Optional]

# App Router integration

Let's start by creating a `formOption` that we'll use to share the form's shape across the client and server.

```typescript
// shared-code.ts
// Notice the import path is different from the client
import { formOptions } from '@tanstack/react-form/nextjs'

// You can pass other form options here, like `validatorAdapter`
export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
})
```

Next, we can create [a React Server Action](https://unicorn-utterances.com/posts/what-are-react-server-components) that will handle the form submission on the server.

```typescript
// action.ts
'use server'

// Notice the import path is different from the client
import { createServerValidate } from '@tanstack/react-form/nextjs'
import { formOpts } from './shared-code'

// Create the server action that will infer the types of the form from `formOpts`
const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export default async function someAction(prev: unknown, formData: FormData) {
  return await serverValidate(formData)
}
```

Finally, we'll use `someAction` in our client-side form component.

```tsx
// client-component.tsx
'use client'

import { useActionState } from 'react'
// Notice the import is from `react-form`, not `react-form/nextjs`
import {
  initialFormState,
  mergeForm,
  useForm,
  useTransform,
} from '@tanstack/react-form'
import someAction from './action'
import { formOpts } from './shared-code'

export const ClientComp = () => {
  const [state, action] = useActionState(someAction, initialFormState)

  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  })

  const formErrors = form.useStore((formState) => formState.errors)

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
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

Here, we're using [React's `useActionState` hook](https://unicorn-utterances.com/posts/what-is-use-action-state-and-form-status) and TanStack Form's `useTransform` hook to merge state returned from the server action with the form state.

> If you get the following error in your Next.js application:
>
> ```typescript
> x You're importing a component that needs `useState`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"` directive.
> ```
>
> This is because you're not importing server-side code from `@tanstack/react-form/nextjs`. Ensure you're importing the correct module based on the environment.
>
>
> [This is a limitation of Next.js](https://github.com/phryneas/rehackt). Other meta-frameworks will likely not have this same problem.
