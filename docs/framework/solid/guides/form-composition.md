---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is its verbosity out-of-the-box. While this _can_ be useful for educational purposes - helping enforce understanding our APIs - it's not ideal in production use cases.

As a result, while `form.Field` enables the most powerful and flexible usage of TanStack Form, we provide APIs that wrap it and make your application code less verbose.

## Custom Form Hooks

The most powerful way to compose forms is to create custom form hooks. This allows you to create a form hook that is tailored to your application's needs, including pre-bound custom UI components and more.

At it's most basic, `createFormHook` is a function that takes a `fieldContext` and `formContext` and returns a `useAppForm` hook.

> This un-customized `useAppForm` hook is identical to `useForm`, but that will quickly change as we add more options to `createFormHook`.

```tsx
import { createFormHookContexts, createFormHook } from '@tanstack/solid-form'

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {},
  formComponents: {},
})

function App() {
  const form = useAppForm(() => ({
    // Supports all useForm options
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  return <form.Field /> // ...
}
```

### Pre-bound Field Components

Once this scaffolding is in place, you can start adding custom field and form components to your form hook.

> Note: the `useFieldContext` must be the same one exported from your custom form context

```tsx
import { useFieldContext } from './form-context.tsx'

export function TextField(props: { label: string }) {
  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>()
  return (
    <label>
      <div>{props.label}</div>
      <input
        value={field().state.value}
        onChange={(e) => field().handleChange(e.target.value)}
      />
    </label>
  )
}
```

You're then able to register this component with your form hook.

```tsx
import { TextField } from './text-field.tsx'

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
```

And use it in your form:

```tsx
function App() {
  const form = useAppForm(() => ({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

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

### Pre-bound Form Components

While `form.AppField` solves many of the problems with Field boilerplate and reusability, it doesn't solve the problem of _form_ boilerplate and reusability.

In particular, being able to share instances of `form.Subscribe` for, say, a reactive form submission button is a common usecase.

```tsx
function SubscribeButton(props: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting()}>
          {props.label}
        </button>
      )}
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
  const form = useAppForm(() => ({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  return (
    <form.AppForm>
      // Notice the `AppForm` component wrapper; `AppForm` provides the required
      context
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  )
}
```

## Breaking big forms into smaller pieces

Sometimes forms get very large; it's just how it goes sometimes. While TanStack Form supports large forms well, it's never fun to work with hundreds or thousands of lines of code long files.

To solve this, we support breaking forms into smaller pieces using the `withForm` higher-order component.

```tsx
const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

const ChildForm = withForm({
  // These values are only used for type-checking, and are not used at runtime
  // This allows you to `...formOpts` from `formOptions` without needing to redeclare the options
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These props are also set as default values for the `render` function
    title: 'Child Form',
  },
  render: function Render(props) {
    return (
      <div>
        <p>{props.title}</p>
        <props.form.AppField
          name="firstName"
          children={(field) => <field.TextField label="First Name" />}
        />
        <props.form.AppForm>
          <props.form.SubscribeButton label="Submit" />
        </props.form.AppForm>
      </div>
    )
  },
})

function App() {
  const form = useAppForm(() => ({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  return <ChildForm form={form} title={'Testing'} />
}
```

### `withForm` FAQ

> Why a higher-order component instead of a hook?
>
> While hooks are the future of Solid, higher-order components are still a powerful tool for composition. In particular, the API of `withForm` enables us to have strong type-safety without requiring users to pass generics.

## Reusing groups of fields in multiple forms

Sometimes, a pair of fields are so closely related that it makes sense to group and reuse them — like the password example listed in the [linked fields guide](../linked-fields.md). Instead of repeating this logic across multiple forms, you can utilize the `withFieldGroup` higher-order component.

> Unlike `withForm`, validators cannot be specified and could be any value.
> Ensure that your fields can accept unknown error types.

Rewriting the passwords example using `withFieldGroup` would look like this:

```tsx
const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    ErrorInfo,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

type PasswordFields = {
  password: string
  confirm_password: string
}

// These default values are not used at runtime, but the keys are needed for mapping purposes.
// This allows you to spread `formOptions` without needing to redeclare it.
const defaultValues: PasswordFields = {
  password: '',
  confirm_password: '',
}

const FieldGroupPasswordFields = withFieldGroup({
  defaultValues,
  // You may also restrict the group to only use forms that implement this submit meta.
  // If none is provided, any form with the right defaultValues may use it.
  // onSubmitMeta: { action: '' }

  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These default values are also for type-checking and are not used at runtime
    title: 'Password',
  },
  // Internally, you will have access to a `group` instead of a `form`
  render: function Render(props) {
    // access reactive values using the group store
    const password = useStore(
      props.group.store,
      (state) => state.values.password,
    )
    // or the form itself
    const isSubmitting = useStore(
      props.group.form.store,
      (state) => state.isSubmitting,
    )

    return (
      <div>
        <h2>{props.title}</h2>
        {/* Groups also have access to Field, Subscribe, Field, AppField and AppForm */}
        <props.group.AppField name="password">
          {(field) => <field.TextField label="Password" />}
        </props.group.AppField>
        <props.group.AppField
          name="confirm_password"
          validators={{
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) => {
              // The form could be any values, so it is typed as 'unknown'
              const values: unknown = fieldApi.form.state.values
              // use the group methods instead
              if (value !== props.group.getFieldValue('password')) {
                return 'Passwords do not match'
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <div>
              <field.TextField label="Confirm Password" />
              <field.ErrorInfo />
            </div>
          )}
        </props.group.AppField>
      </div>
    )
  },
})
```

We can now use these grouped fields in any form that implements the default values:

```tsx
// You are allowed to extend the group fields as long as the
// existing properties remain unchanged
type Account = PasswordFields & {
  provider: string
  username: string
}

// You may nest the group fields wherever you want
type FormValues = {
  name: string
  age: number
  account_data: PasswordFields
  linked_accounts: Account[]
}

const defaultValues: FormValues = {
  name: '',
  age: 0,
  account_data: {
    password: '',
    confirm_password: '',
  },
  linked_accounts: [
    {
      provider: 'TanStack',
      username: '',
      password: '',
      confirm_password: '',
    },
  ],
}

function App() {
  const form = useAppForm(() => ({
    defaultValues,
    // If the group didn't specify an `onSubmitMeta` property,
    // the form may implement any meta it wants.
    // Otherwise, the meta must be defined and match.
    onSubmitMeta: { action: '' },
  }))

  return (
    <form.AppForm>
      <FieldGroupPasswordFields
        form={form}
        // You must specify where the fields can be found
        fields="account_data"
        title="Passwords"
      />
      <form.Field name="linked_accounts" mode="array">
        {(field) =>
          field().state.value.map((account, i) => (
            <FieldGroupPasswordFields
              key={account.provider}
              form={form}
              // The fields may be in nested fields
              fields={`linked_accounts[${i}]`}
              title={account.provider}
            />
          ))
        }
      </form.Field>
    </form.AppForm>
  )
}
```

### Mapping field group values to a different field

You may want to keep the password fields on the top level of your form, or rename the properties for clarity. You can map field group values
to their true location by changing the `field` property:

> [!IMPORTANT]
> Due to TypeScript limitations, field mapping is only allowed for objects. You can use records or arrays at the top level of a field group, but you will not be able to map the fields.

```tsx
// To have an easier form, you can keep the fields on the top level
type FormValues = {
  name: string
  age: number
  password: string
  confirm_password: string
}

const defaultValues: FormValues = {
  name: '',
  age: 0,
  password: '',
  confirm_password: '',
}

function App() {
  const form = useAppForm(() => ({
    defaultValues,
  }))

  return (
    <form.AppForm>
      <FieldGroupPasswordFields
        form={form}
        // You can map the fields to their equivalent deep key
        fields={{
          password: 'password',
          confirm_password: 'confirm_password',
          // or map them to differently named keys entirely
          // 'password': 'name'
        }}
        title="Passwords"
      />
    </form.AppForm>
  )
}
```

If you expect your fields to always be at the top level of your form, you can create a quick map
of your field groups using a helper function:

```tsx
const defaultValues: PasswordFields = {
  password: '',
  confirm_password: '',
}

const passwordFields = createFieldMap(defaultValues)
/* This generates the following map:
 {
    'password': 'password',
    'confirm_password': 'confirm_password'
 }
*/

// Usage:
<FieldGroupPasswordFields
  form={form}
  fields={passwordFields}
  title="Passwords"
/>
```

## Tree-shaking form and field components

While the above examples are great for getting started, they're not ideal for certain use-cases where you might have hundreds of form and field components.
In particular, you may not want to include all of your form and field components in the bundle of every file that uses your form hook.

To solve this, you can mix the `createFormHook` TanStack API with the Solid `lazy` and `Suspense` components:

```typescript
// src/hooks/form-context.ts
import { createFormHookContexts } from '@tanstack/solid-form'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()
```

```tsx
// src/components/text-field.tsx
import { useFieldContext } from '../hooks/form-context.tsx'

export default function TextField(props: { label: string }) {
  const field = useFieldContext<string>()

  return (
    <label>
      <div>{props.label}</div>
      <input
        value={field().state.value}
        onChange={(e) => field().handleChange(e.target.value)}
      />
    </label>
  )
}
```

```tsx
// src/hooks/form.ts
import { lazy } from 'solid-js'
import { createFormHook } from '@tanstack/solid-form'

const TextField = lazy(() => import('../components/text-fields.tsx'))

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
```

```tsx
// src/App.tsx
import { Suspense } from 'solid-js'
import { PeoplePage } from './features/people/form.tsx'

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PeoplePage />
    </Suspense>
  )
}
```

This will show the Suspense fallback while the `TextField` component is being loaded, and then render the form once it's loaded.

## Putting it all together

Now that we've covered the basics of creating custom form hooks, let's put it all together in a single example.

```tsx
// /src/hooks/form.ts, to be used across the entire app
const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function TextField(props: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <label>
      <div>{props.label}</div>
      <input
        value={field().state.value}
        onChange={(e) => field().handleChange(e.target.value)}
      />
    </label>
  )
}

function SubscribeButton(props: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button disabled={isSubmitting()}>{props.label}</button>
      )}
    </form.Subscribe>
  )
}

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

// /src/features/people/shared-form.ts, to be used across `people` features
const formOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})

// /src/features/people/nested-form.ts, to be used in the `people` page
const ChildForm = withForm({
  ...formOpts,
  // Optional, but adds props to the `render` function outside of `form`
  props: {
    title: 'Child Form',
  },
  render: (props) => {
    return (
      <div>
        <p>{props.title}</p>
        <props.form.AppField
          name="firstName"
          children={(field) => <field.TextField label="First Name" />}
        />
        <props.form.AppForm>
          <props.form.SubscribeButton label="Submit" />
        </props.form.AppForm>
      </div>
    )
  },
})

// /src/features/people/page.ts
const Parent = () => {
  const form = useAppForm(() => ({
    ...formOpts,
  }))

  return <ChildForm form={form} title={'Testing'} />
}
```

## API Usage Guidance

Here's a chart to help you decide what APIs you should be using:

![](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/react_form_composability.svg)
