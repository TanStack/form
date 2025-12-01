---
id: form-composition
title: Form Composition
---

A common criticism of TanStack Form is its verbosity out-of-the-box. While this _can_ be useful for educational purposes - helping enforce understanding our APIs - it's not ideal in production use cases.

As a result, while `form.Field` enables the most powerful and flexible usage of TanStack Form, we provide APIs that wrap it and make your application code less verbose.

## Custom Form Methods

The most powerful way to compose forms is to create custom form methods. This allows you to create a form method that is tailored to your application's needs, including pre-bound custom UI components and more.

At its most basic, `createFormCreator` is a function that returns a `createAppForm` method.

> This un-customized `createAppForm` method is identical to `createForm`, but that will quickly change as we add more options to `createFormCreator`.
```ts
// form-context.ts
import { createFormCreatorContexts } from '@tanstack/svelte-form'

// export useFieldContext and useFormContext for use in your custom components
export const { useFieldContext, useFormContext } = createFormCreatorContexts()
```

```ts
// form.ts
import { createFormCreator } from '@tanstack/svelte-form'

export const { createAppForm } = createFormCreator({
  // We'll learn more about these options later
  fieldComponents: {},
  formComponents: {},
})
```

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { createAppForm } from './form.js'

  const form = createAppForm(() => ({
    // Supports all createForm options
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))
</script>

<form.Field name="firstName">
  <!-- ... -->
</form.Field>
```

### Pre-bound Field Components

Once this scaffolding is in place, you can start adding custom field and form components to your form method.

> Note: the `useFieldContext` must be the same one exported from your custom form context

```svelte
<!-- text-field.svelte -->
<script lang="ts">
  import { useFieldContext } from './form-context.js'

  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>()

  const { label }: { label: string } = $props()
</script>

<label>
  <div>{label}</div>
  <input
    value={field.state.value}
    oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
  />
</label>
```

You're then able to register this component with your form method.

```ts
import { createFormCreator } from '@tanstack/svelte-form'
import TextField from './text-field.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
```

And use it in your form:

```svelte
<script lang="ts">
  import { createAppForm } from './form.js'

  const form = createAppForm(() => ({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))
</script>

<!-- Notice the `AppField` instead of `Field`; `AppField` provides the required context -->
<form.AppField name="firstName">
  {#snippet children(field)}
    <field.TextField label="First Name" />
  {/snippet}
</form.AppField>
```

This not only allows you to reuse the UI of your shared component, but retains the type-safety you'd expect from TanStack Form: Typo `name` and get a TypeScript error.

### Pre-bound Form Components

While `form.AppField` solves many of the problems with Field boilerplate and reusability, it doesn't solve the problem of _form_ boilerplate and reusability.

In particular, being able to share instances of `form.Subscribe` for, say, a reactive form submission button is a common usecase.

```svelte
<!-- subscribe-button.svelte -->
<script lang="ts">
  import { useFormContext } from './form-context.js'

  const form = useFormContext()

  const { label }: { label: string } = $props()
</script>

<form.Subscribe selector={(state) => state.isSubmitting}>
  {#snippet children(isSubmitting)}
    <button type="submit" disabled={isSubmitting}>
      {label}
    </button>
  {/snippet}
</form.Subscribe>
```

```ts
// form.ts
import { createFormCreator } from '@tanstack/svelte-form'
import TextField from './text-field.svelte'
import SubscribeButton from './subscribe-button.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
})
```

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { createAppForm } from './form.js'

  const form = createAppForm(() => ({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))
</script>

<form.AppForm>
  <!-- Notice the `AppForm` component wrapper; `AppForm` provides the required context -->
  {#snippet children()}
    <form.SubscribeButton label="Submit" />
  {/snippet}
</form.AppForm>
```

## Breaking big forms into smaller pieces

Sometimes forms get very large; it's just how it goes sometimes. While TanStack Form supports large forms well, it's never fun to work with hundreds or thousands of lines of code long files.

To solve this, you can break forms into smaller Svelte components that accept the form as a prop.

```ts
// shared-form.ts
import { formOptions } from '@tanstack/svelte-form'

export const peopleFormOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})
```

```svelte
<!-- child-form.svelte -->
<script lang="ts">
  import type { createAppForm } from './form.js'
  import { peopleFormOpts } from './shared-form.js'

  type AppForm = ReturnType<typeof createAppForm<typeof peopleFormOpts.defaultValues>>

  const { form, title = 'Child Form' }: { form: AppForm; title?: string } = $props()
</script>

<div>
  <p>{title}</p>
  <form.AppField name="firstName">
    {#snippet children(field)}
      <field.TextField label="First Name" />
    {/snippet}
  </form.AppField>
  <form.AppForm>
    {#snippet children()}
      <form.SubscribeButton label="Submit" />
    {/snippet}
  </form.AppForm>
</div>
```

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { createAppForm } from './form.js'
  import { peopleFormOpts } from './shared-form.js'
  import ChildForm from './child-form.svelte'

  const form = createAppForm(() => ({
    ...peopleFormOpts,
  }))
</script>

<ChildForm {form} title="Testing" />
```

## Reusing groups of fields in multiple forms

Sometimes, a pair of fields are so closely related that it makes sense to group and reuse them — like the password example listed in the [linked fields guide](../linked-fields.md). Instead of repeating this logic across multiple forms, you can create reusable field group components.

> Unlike form-level components, validators in field groups cannot be strictly typed and could be any value.
> Ensure that your fields can accept unknown error types.

Rewriting the passwords example as a reusable component would look like this:

```svelte
<!-- password-fields.svelte -->
<script lang="ts">
  import type { createAppForm } from './form.js'

  type PasswordFields = {
    password: string
    confirm_password: string
  }

  type AppForm = ReturnType<typeof createAppForm<PasswordFields>>

  const { form, title = 'Password' }: { form: AppForm; title?: string } = $props()
</script>

<div>
  <h2>{title}</h2>
  <form.AppField name="password">
    {#snippet children(field)}
      <field.TextField label="Password" />
    {/snippet}
  </form.AppField>
  <form.AppField
    name="confirm_password"
    validators={{
      onChangeListenTo: ['password'],
      onChange: ({ value, fieldApi }) => {
        if (value !== fieldApi.form.getFieldValue('password')) {
          return 'Passwords do not match'
        }
        return undefined
      },
    }}
  >
    {#snippet children(field)}
      <div>
        <field.TextField label="Confirm Password" />
        {#each field.state.meta.errors as error}
          <div style="color: red;">{error}</div>
        {/each}
      </div>
    {/snippet}
  </form.AppField>
</div>
```

We can now use these grouped fields in any form that implements the required fields:

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { createAppForm } from './form.js'
  import PasswordFields from './password-fields.svelte'

  const form = createAppForm(() => ({
    defaultValues: {
      name: '',
      age: 0,
      password: '',
      confirm_password: '',
    },
  }))
</script>

<form.AppForm>
  {#snippet children()}
    <form.AppField name="name">
      {#snippet children(field)}
        <field.TextField label="Name" />
      {/snippet}
    </form.AppField>
    <PasswordFields {form} title="Account Password" />
    <form.SubscribeButton label="Submit" />
  {/snippet}
</form.AppForm>
```

## Tree-shaking form and field components

While the above examples are great for getting started, they're not ideal for certain use-cases where you might have hundreds of form and field components.
In particular, you may not want to include all of your form and field components in the bundle of every file that uses your form method.

To solve this, you can use dynamic imports with Svelte's component loading:

```ts
// src/utils/form-context.ts
import { createFormCreatorContexts } from '@tanstack/svelte-form'

export const { useFieldContext, useFormContext } = createFormCreatorContexts()
```

```svelte
<!-- src/components/text-field.svelte -->
<script lang="ts">
  import { useFieldContext } from '../utils/form-context.js'

  const field = useFieldContext<string>()

  const { label }: { label: string } = $props()
</script>

<label>
  <div>{label}</div>
  <input
    value={field.state.value}
    oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
  />
</label>
```

```ts
// src/utils/form.ts
import { createFormCreator } from '@tanstack/svelte-form'
import TextField from '../components/text-field.svelte'
import SubscribeButton from '../components/subscribe-button.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
})
```

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import PeoplePage from './features/people/page.svelte'
</script>

<PeoplePage />
```

## Putting it all together

Now that we've covered the basics of creating custom form methods, let's put it all together in a single example.

```ts
// /src/utils/form-context.ts, to be used across the entire app
import { createFormCreatorContexts } from '@tanstack/svelte-form'

export const { useFieldContext, useFormContext } = createFormCreatorContexts()
```

```svelte
<!-- /src/components/text-field.svelte -->
<script lang="ts">
  import { useFieldContext } from '../utils/form-context.js'

  const field = useFieldContext<string>()

  const { label }: { label: string } = $props()
</script>

<label>
  <div>{label}</div>
  <input
    value={field.state.value}
    oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
  />
</label>
```

```svelte
<!-- /src/components/subscribe-button.svelte -->
<script lang="ts">
  import { useFormContext } from '../utils/form-context.js'

  const form = useFormContext()

  const { label }: { label: string } = $props()
</script>

<form.Subscribe selector={(state) => state.isSubmitting}>
  {#snippet children(isSubmitting)}
    <button type="submit" disabled={isSubmitting}>
      {label}
    </button>
  {/snippet}
</form.Subscribe>
```

```ts
// /src/utils/form.ts
import { createFormCreator } from '@tanstack/svelte-form'
import TextField from '../components/text-field.svelte'
import SubscribeButton from '../components/subscribe-button.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
})
```

```ts
// /src/features/people/shared-form.ts, to be used across `people` features
import { formOptions } from '@tanstack/svelte-form'

export const peopleFormOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  },
})
```

```svelte
<!-- /src/features/people/child-form.svelte, to be used in the `people` page -->
<script lang="ts">
  import type { createAppForm } from '../../utils/form.js'
  import { peopleFormOpts } from './shared-form.js'

  type AppForm = ReturnType<typeof createAppForm<typeof peopleFormOpts.defaultValues>>

  const { form, title = 'Child Form' }: { form: AppForm; title?: string } = $props()
</script>

<div>
  <p>{title}</p>
  <form.AppField name="firstName">
    {#snippet children(field)}
      <field.TextField label="First Name" />
    {/snippet}
  </form.AppField>
  <form.AppForm>
    {#snippet children()}
      <form.SubscribeButton label="Submit" />
    {/snippet}
  </form.AppForm>
</div>
```

```svelte
<!-- /src/features/people/page.svelte -->
<script lang="ts">
  import { createAppForm } from '../../utils/form.js'
  import { peopleFormOpts } from './shared-form.js'
  import ChildForm from './child-form.svelte'

  const form = createAppForm(() => ({
    ...peopleFormOpts,
  }))
</script>

<ChildForm {form} title="Testing" />
```

## API Usage Guidance

Here's a chart to help you decide what APIs you should be using:

![](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/svelte_form_composability.svg)
