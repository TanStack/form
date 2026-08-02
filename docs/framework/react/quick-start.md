---
id: quick-start
title: Quick Start
---

TanStack Form is a headless, type-safe form library. It owns form state and
validation while leaving markup, styling, and component choice to you.

Install the React adapter:

```bash
npm install @tanstack/react-form
```

## Create a form

`useForm` requires `defaultValues`. Their shape becomes the form's inferred
value type.

```tsx
import { useForm } from '@tanstack/react-form'

export function ProfileForm() {
  const form = useForm({
    defaultValues: {
      fullName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
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
              name={field.name}
              value={field.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={field.meta.isInvalid}
            />
            {field.errors.map((error) => (
              <span key={error.message} role="alert">
                {error.message}
              </span>
            ))}
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
              name={field.name}
              type="number"
              value={field.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.valueAsNumber)
              }
              aria-invalid={field.meta.isInvalid}
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

The important pieces are:

- `defaultValues` define the complete initial value and drive type inference.
- `form.Field` subscribes to one field. Its render prop exposes `field.value`,
  `field.meta`, and event handlers.
- Validators are ordered objects with a `run` function and explicit
  `triggers`.
- `form.Subscribe` rerenders only its own children when the selected form state
  changes.
- `form.handleSubmit()` validates the form before calling `onSubmit`.