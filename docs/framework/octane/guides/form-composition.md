---
id: form-composition
title: Form Composition
---

TanStack Form's `form.Field` API gives you control over every input and validation message. That flexibility can also produce repetitive code. Custom form hooks let you bind reusable Octane components to your form while preserving field-name and value types.

The examples in this guide use TSRX. Save modules that render templates with the `.tsrx` extension and compile them with Octane's Vite plugin, as described in the [quick start](../quick-start.md).

## Custom Form Hooks

`createFormHook` takes shared field and form contexts and returns a `useAppForm` hook. With no components registered, `useAppForm` accepts the same options as `useForm`:

```ts
// src/hooks/form-context.ts
import { createFormHookContexts } from '@tanstack/octane-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()
```

```ts
// src/hooks/form.ts
import { createFormHook } from '@tanstack/octane-form'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})
```

```tsrx
// src/App.tsrx
import { useAppForm } from './hooks/form'

export function App() @{
  const form = useAppForm({
    defaultValues: { firstName: 'John', lastName: 'Doe' },
  })

  <form.Field
    name="firstName"
    children={(field) =>
      <input
        value={field.state.value}
        onInput={(event) => field.handleChange(event.currentTarget.value)}
        onBlur={field.handleBlur}
      />}
  />
}
```

### Pre-bound Field Components

Use the `useFieldContext` exported from your shared context module in custom field components. The generic specifies the value type that the component accepts. Use `useSelector` to subscribe to the field state the component needs:

```tsrx
// src/components/text-field.tsrx
import { useSelector } from '@tanstack/octane-form'
import { useFieldContext } from '../hooks/form-context'

export function TextField({
  label,
  type = 'text',
}: {
  label: string;
  type?: 'text' | 'password';
}) @{
  const field = useFieldContext<string>()
  const value = useSelector(field.store, (state) => state.value)

  <label>
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onInput={(event) => field.handleChange(event.currentTarget.value)}
      onBlur={field.handleBlur}
    />
  </label>
}
```

Register the component with your form hook:

```tsrx
// src/hooks/form.tsrx
import { createFormHook } from '@tanstack/octane-form'
import { TextField } from '../components/text-field.tsrx'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
})
```

Use `AppField` to provide the field context and access your registered component:

```tsrx
function App() @{
  const form = useAppForm({
    defaultValues: { firstName: 'John', lastName: 'Doe' },
  })

  <form.AppField
    name="firstName"
    children={(field) => <field.TextField label="First Name" />}
  />
}
```

The field's `name` remains checked against the form's values. Mistyping `firstName` produces a TypeScript error.

#### A note on performance

These contexts provide stable form and field API instances. State subscriptions come from `useSelector`, `Field`, and `Subscribe`, so sharing an API instance through context does not subscribe every consumer to every form change. Select only the state that a component needs.

### Pre-bound Form Components

Form components can use `useFormContext` to share behavior such as a submission button. Wrap them in `form.AppForm` to provide the context:

```tsrx
import { createFormHook } from '@tanstack/octane-form'
import { fieldContext, formContext, useFormContext } from './form-context'

function SubscribeButton({ label }: { label: string }) @{
  const form = useFormContext()

  <form.Subscribe
    selector={(state) => state.isSubmitting}
    children={(isSubmitting) =>
      <button type="submit" disabled={isSubmitting}>{label}</button>}
  />
}

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: { SubscribeButton },
})

function App() @{
  const form = useAppForm({
    defaultValues: { firstName: 'John', lastName: 'Doe' },
    onSubmit: ({ value }) => console.log(value),
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </form>
}
```

`AppForm` is a context provider. Use a native `<form>` element to handle browser submission.

## Breaking big forms into smaller pieces

`withForm` creates a component that receives a typed form instance. Its `defaultValues` describe the expected values for type checking; they do not initialize the parent form. `props` declares additional props and their defaults:

```tsrx
const ChildForm = withForm({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
  props: { title: 'Child Form' },
  render: ({ form, title }) => <div>
    <h2>{title}</h2>
    <form.AppField
      name="firstName"
      children={(field) => <field.TextField label="First Name" />}
    />
    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </div>,
})

function App() @{
  const form = useAppForm({
    defaultValues: { firstName: 'John', lastName: 'Doe' },
  })

  <ChildForm form={form} title="Testing" />
}
```

This example assumes `TextField` and `SubscribeButton` are both registered with the same `createFormHook` call.

### `withForm` FAQ

> Why a higher-order component instead of a hook?

Passing the form through `withForm` lets TypeScript infer the expected form values and additional props without requiring you to supply the form's generics.

> How should I write the render callback in TSRX?

Use an arrow callback. A callback that only renders a template can use `render: ({ form }) => <div>...</div>`. When you need local setup or hooks, use a regular TypeScript callback with an explicit `return`:

```tsrx
const ChildForm = withForm({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
  render: ({ form }) => {
    const firstName = useSelector(form.store, (state) => state.values.firstName)

    return <p>Hello, {firstName}</p>
  },
})
```

Import `useSelector` from `@tanstack/octane-form`. Keep the `render` callback as an ordinary callback: `withForm` calls it with form props. Use TSRX statement containers (`@{ ... }`) and template directives such as `@if` in child components rendered by that callback.

### Context as a last resort

Some integrations render children without allowing you to pass the form through their props. `useTypedAppFormContext` provides a fallback for those situations:

```tsrx
import { createFormHook, formOptions } from '@tanstack/octane-form'
import { fieldContext, formContext } from './hooks/form-context'
import { TextField } from './components/text-field.tsrx'

const { useAppForm, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
})

const formOpts = formOptions({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
})

function ParentComponent() @{
  const form = useAppForm(formOpts)

  <form.AppForm>
    <ChildComponent />
  </form.AppForm>
}

function ChildComponent() @{
  const form = useTypedAppFormContext(formOpts)

  <form.AppField
    name="firstName"
    children={(field) => <field.TextField label="First Name" />}
  />
}
```

> [!IMPORTANT] Type safety
> Prefer `withForm` when you can pass the form explicitly. Context cannot verify that the provider's actual form matches the options supplied to `useTypedAppFormContext`; mismatched types can cause runtime errors.

## Reusing groups of fields in multiple forms

`withFieldGroup` lets related fields, such as the password fields from the [linked fields guide](./linked-fields.md), be reused across forms with different shapes.

The group's default values describe its fields for typing and mapping. They are not used to initialize the parent form. Validators on the parent can return different error types, so shared error components should accept unknown errors:

```tsrx
function ErrorInfo() @{
  const field = useFieldContext<unknown>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  <div role="alert">
    @for (const error of errors; index i; key i) {
      <p>
        {typeof error === 'string' ? error : JSON.stringify(error)}
      </p>
    }
  </div>
}

const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, ErrorInfo },
  formComponents: { SubscribeButton },
})

type PasswordFields = {
  password: string;
  confirm_password: string;
}

const passwordDefaults: PasswordFields = {
  password: '',
  confirm_password: '',
}

function PasswordHint({ password }: { password: string }) @{
  @if (password.length === 0) {
    <p>Choose a password for this account.</p>
  }
}

const PasswordGroup = withFieldGroup({
  defaultValues: passwordDefaults,
  props: { title: 'Password' },
  render: ({ group, title }) => {
    // A group's store exposes its relative values.
    const password = useSelector(group.store, (state) => state.values.password)
    // The parent form's store remains available too.
    const isSubmitting = useSelector(
      group.form.store,
      (state) => state.isSubmitting,
    )

    return <fieldset disabled={isSubmitting}>
      <legend>{title}</legend>
      <group.AppField
        name="password"
        children={(field) =>
          <field.TextField label="Password" type="password" />}
      />
      <group.AppField
        name="confirm_password"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value }) => value !== group.getFieldValue('password')
            ? 'Passwords do not match'
            : undefined,
        }}
        children={(field) => <div>
          <field.TextField label="Confirm Password" type="password" />
          <field.ErrorInfo />
        </div>}
      />
      <PasswordHint password={password} />
    </fieldset>
  },
})
```

Inside the group, use relative field names and methods such as `group.getFieldValue('password')`. The parent form's overall values are typed as `unknown`, since the group can be attached to many different form shapes.

Use `fields` to select where the group's values live:

```tsrx
type Account =
  PasswordFields & {
    provider: string;
    username: string;
  }

type FormValues = {
  name: string;
  age: number;
  account_data: PasswordFields;
  linked_accounts: Account[];
}

const defaultValues: FormValues = {
  name: '',
  age: 0,
  account_data: { password: '', confirm_password: '' },
  linked_accounts: [
    {
      provider: 'TanStack',
      username: '',
      password: '',
      confirm_password: '',
    },
  ],
}

function App() @{
  const form = useAppForm({
    defaultValues,
    onSubmitMeta: { action: '' },
  })

  <form.AppForm>
    <PasswordGroup form={form} fields="account_data" title="Passwords" />
    <form.Field
      name="linked_accounts"
      mode="array"
      children={(field) => <div>
        @for (const account of field.state.value; index i; key account.provider) {
          <PasswordGroup
            form={form}
            fields={`linked_accounts[${i}]`}
            title={account.provider}
          />
        }
      </div>}
    />
  </form.AppForm>
}
```

This example uses a unique provider as each row's key. If your data allows multiple accounts with the same provider, give each account a stable ID and use that as the key.

A group can also declare `onSubmitMeta` to restrict the forms that use it to a particular submit metadata type. If it omits that option, the parent form may use any submit metadata.

### Mapping field group values to a different field

Pass an object to `fields` to map the group's property names to paths in the parent form:

```tsrx
function App() @{
  const form = useAppForm({
    defaultValues: {
      name: '',
      age: 0,
      password: '',
      passwordConfirmation: '',
    },
  })

  <PasswordGroup
    form={form}
    fields={{
      password: 'password',
      confirm_password: 'passwordConfirmation',
    }}
    title="Passwords"
  />
}
```

> [!IMPORTANT]
> TypeScript only supports this property mapping for object groups. A group can have an array or record as its top-level value, but that value cannot use this field mapping.

When the group property names match the parent field names, `createFieldMap` builds the mapping for you:

```tsrx
import { createFieldMap } from '@tanstack/octane-form'

const passwordFields = createFieldMap(passwordDefaults)
// { password: 'password', confirm_password: 'confirm_password' }

<PasswordGroup form={form} fields={passwordFields} title="Passwords" />
```

## Tree-shaking form and field components

Registering many components in one shared hook can make every consumer import all of them. Use Octane's `lazy` to split a field component into a separate chunk:

```tsrx
// src/components/text-field.tsrx
import { useSelector } from '@tanstack/octane-form'
import { useFieldContext } from '../hooks/form-context'

export default function TextField({
  label,
  type = 'text',
}: {
  label: string;
  type?: 'text' | 'password';
}) @{
  const field = useFieldContext<string>()
  const value = useSelector(field.store, (state) => state.value)

  <label>
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onInput={(event) => field.handleChange(event.currentTarget.value)}
      onBlur={field.handleBlur}
    />
  </label>
}
```

```tsrx
// src/hooks/form.tsrx
import { lazy } from 'octane'
import { createFormHook } from '@tanstack/octane-form'
import { fieldContext, formContext } from './form-context'

const TextField = lazy(() => import('../components/text-field.tsrx'))

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
})
```

Wrap the form's page in a TSRX pending boundary to display a fallback while the component loads:

```tsrx
// src/App.tsrx
import { PeoplePage } from './features/people/page.tsrx'

export function App() @{
  @try {
    <PeoplePage />
  } @pending {
    <p>Loading...</p>
  }
}
```

Keep the context module separate from the component module, so both the form hook and the lazy component import the same contexts without a circular dependency.

## Putting it all together

The following example combines shared contexts, bound components, reusable form options, and a typed child form:

```tsrx
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
  useSelector,
} from '@tanstack/octane-form'

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function TextField({
  label,
  type = 'text',
}: {
  label: string;
  type?: 'text' | 'password';
}) @{
  const field = useFieldContext<string>()
  const value = useSelector(field.store, (state) => state.value)

  <label>
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onInput={(event) => field.handleChange(event.currentTarget.value)}
      onBlur={field.handleBlur}
    />
  </label>
}

function SubscribeButton({ label }: { label: string }) @{
  const form = useFormContext()

  <form.Subscribe
    selector={(state) => state.isSubmitting}
    children={(isSubmitting) =>
      <button type="submit" disabled={isSubmitting}>{label}</button>}
  />
}

const { useAppForm, withForm } = createFormHook({
  fieldComponents: { TextField },
  formComponents: { SubscribeButton },
  fieldContext,
  formContext,
})

const formOpts = formOptions({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
})

const ChildForm = withForm({
  ...formOpts,
  props: { title: 'Child Form' },
  render: ({ form, title }) => <div>
    <h2>{title}</h2>
    <form.AppField
      name="firstName"
      children={(field) => <field.TextField label="First Name" />}
    />
    <form.AppForm>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  </div>,
})

export function Parent() @{
  const form = useAppForm({
    ...formOpts,
    onSubmit: ({ value }) => console.log(value),
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <ChildForm form={form} title="Testing" />
  </form>
}
```

## API Usage Guidance

- Use `Field` for individual fields that need direct control over their UI.
- Use `createFormHook`, `AppField`, and `AppForm` to share your application's field and form components.
- Use `withForm` to split one typed form into smaller components.
- Use `withFieldGroup` to reuse related fields across different form shapes.
- Use `FormGroup` when a stage of a form needs its own validation and submission behavior.
- Use `useTypedAppFormContext` when an integration prevents passing a form explicitly.
