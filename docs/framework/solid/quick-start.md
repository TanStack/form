---
id: quick-start
title: Quick Start
---

TanStack Form is a headless, type-safe form library. It owns form state and
validation while leaving markup, styling, and component choice to you.

Install the Solid adapter:

```bash
npm install @tanstack/solid-form
```

## Create a form

`createForm` requires an options accessor and form-level `defaultValues`. Their
shape becomes the form's inferred value type.

```tsx
import { For } from 'solid-js'
import { createForm } from '@tanstack/solid-form'

export function ProfileForm() {
  const form = createForm(() => ({
    defaultValues: {
      fullName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  }))

  return (
    <form
      onSubmit={(event) => {
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
        {(field) => (
          <label>
            Full name
            <input
              name={field().name}
              value={field().value}
              onBlur={field().handleBlur}
              onInput={(event) =>
                field().handleChange(event.currentTarget.value)
              }
              aria-invalid={field().meta.isInvalid}
            />
            <For each={field().errors}>
              {(error) => <span role="alert">{error.message}</span>}
            </For>
          </label>
        )}
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
        {(field) => (
          <label>
            Age
            <input
              name={field().name}
              type="number"
              value={field().value}
              onBlur={field().handleBlur}
              onInput={(event) =>
                field().handleChange(event.currentTarget.valueAsNumber)
              }
              aria-invalid={field().meta.isInvalid}
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {(state) => (
          <button type="submit" disabled={!state()[0] || state()[1]}>
            {state()[1] ? 'Saving…' : 'Save'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

The important pieces are:

- `defaultValues` define the complete initial value and drive type inference.
- `form.Field` subscribes to one field. Its child receives an accessor that
  exposes `field().value`, `field().meta`, and event handlers.
- Validators are ordered objects with a `run` function and explicit `triggers`.
- `form.Subscribe` exposes the selected form state as a Solid accessor.
- `form.handleSubmit()` validates the form before calling `onSubmit`.
