---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is its verbosity out-of-the-box. While this _can_ be useful for educational purposes - helping enforce understanding our APIs - it's not ideal in production usecases.

As a result, while `form.Field` enables the most powerful and flexible usage of TanStack Form, we provide APIs that wrap it and make your application code less verbose.

# Custom Form Hooks

The most powerful way to compose forms is to create custom form hooks. This allows you to create a form hook that is tailored to your application's needs, including pre-bound custom UI components and more.

At it's most basic, `createFormHook` is a function that takes a `fieldContext` and `formContext` and returns a `useAppForm` hook.

> This un-customized `useAppForm` hook is identical to `useForm`, but that will quickly change as we add more options to `createFormHook`.

```tsx
import {createFormHookContexts, createFormHook } from '@tanstack/react-form'

const { fieldContext, formContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {},
  formComponents: {},
})

function App() {
  const form = useAppForm({
    // Supports all useForm options
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  })

  return <form.Field /> // ...
}
```

## Pre-bound Field Components

Once this scaffolding is in place, you can start adding custom field and form components to your form hook.

```tsx
function TextField({ label }: { label: string }) {
  // Use the context returned from `createFormHookContexts`
  // The `Field` that it should have a `value` type of `string`
  const field = useFieldContext<string>()
  return (
    <label>
      <div>{label}</div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  )
}
```

You're then able to register this component with your form hook.

```tsx
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField
  },
  formComponents: {},
})
```

And use it in your form:

```tsx
function App() {
  const form = useAppForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  })

  return (
    // Notice the `AppField` instead of `Field`; `AppField` provides the required context
    <form.AppField
      name="firstName"
      children={(field) => <field.TextField label="First Name" />}
    />
  )
}
```

This not only allows you to reuse the UI of your shared component, but retains the type-safety you'd expect from TanStack Form: Typo `name` and get a TypeScript error.

### A note on performance

While context is a valuable tool in the React ecosystem, there's appropriate concern from many users that providing a reactive value through a context will cause unnecessary re-renders.

> Unfamiliar with this performance concern? [Mark Erikson's blog post explaining why Redux solves many of these problems](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/) is a great place to start.

While this is a good concern to call out, it's not a problem for TanStack Form; the values provided through context are not reactive themselves, but instead are static class instances with reactive properties ([using TanStack Store as our signals implementation to power the show](https://tanstack.com/store)).

## Pre-bound Form Components

While `form.AppField` solves many of the problems with Field boilerplate and reusability, it doesn't solve the problem of _form_ boilerplate and reusability.

In particular, being able to share instances of `form.Subscribe` for, say, a reactive form submission button is a common usecase.

```tsx
function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  )
}

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

function App() {
  const form = useAppForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  })

  return (
    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  )
}
```
