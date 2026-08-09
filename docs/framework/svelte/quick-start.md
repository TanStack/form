---
id: quick-start
title: Quick Start
---

TanStack Form is a headless, type-safe form library. It owns form state and
validation while leaving markup, styling, and component choice to you.

Install the Svelte adapter:

```bash
npm install @tanstack/svelte-form
```

## Create a form

`createForm` requires an options function and form-level `defaultValues`. Their
shape becomes the form's inferred value type.

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: {
      fullName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  }))
</script>

<form
  onsubmit={(event) => {
    event.preventDefault()
    form.handleSubmit()
  }}
>
  <form.Field
    name="fullName"
    validators={[
      {
        triggers: ['change', 'blur'],
        run: ({ value }) =>
          value.trim() ? undefined : 'Enter your full name',
      },
    ]}
  >
    {#snippet children(field)}
      <label>
        Full name
        <input
          name={field.name}
          value={field.value}
          onblur={field.handleBlur}
          oninput={(event) => field.handleChange(event.currentTarget.value)}
          aria-invalid={field.meta.isInvalid}
        />
        {#each field.errors as error}
          <span role="alert">{error.message}</span>
        {/each}
      </label>
    {/snippet}
  </form.Field>

  <form.Field
    name="age"
    validators={[
      {
        triggers: ['change'],
        run: ({ value }) =>
          value >= 13 ? undefined : 'You must be at least 13',
      },
    ]}
  >
    {#snippet children(field)}
      <label>
        Age
        <input
          name={field.name}
          type="number"
          value={field.value}
          onblur={field.handleBlur}
          oninput={(event) =>
            field.handleChange(event.currentTarget.valueAsNumber)}
          aria-invalid={field.meta.isInvalid}
        />
      </label>
    {/snippet}
  </form.Field>

  <form.Subscribe
    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
  >
    {#snippet children([canSubmit, isSubmitting])}
      <button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save'}
      </button>
    {/snippet}
  </form.Subscribe>
</form>
```

The important pieces are:

- `defaultValues` define the complete initial value and drive type inference.
- `form.Field` subscribes to one field. Its child snippet exposes `field.value`,
  `field.meta`, and event handlers.
- Validators are ordered objects with a `run` function and explicit `triggers`.
- `form.Subscribe` updates only its child snippet when the selected form state
  changes.
- `form.handleSubmit()` validates the form before calling `onSubmit`.
