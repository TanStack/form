---
id: focus-management
title: Focus Management
---

You may want to focus the first input with an error after an invalid submission.

[Because TanStack Form does not control your markup](../../../philosophy.md), focus management belongs in your application. Octane provides native DOM refs that you can use to locate an input within the submitted form.

## Finding an invalid input

Set `aria-invalid` based on the field's validation state, then focus the first invalid element in `onSubmitInvalid`. Scope the search to the form so that another form on the page cannot receive focus accidentally.

```tsrx
import { useRef } from 'octane'
import { useForm } from '@tanstack/octane-form'
import { z } from 'zod'

export default function App() @{
  const formElement = useRef<HTMLFormElement | null>(null)
  const form = useForm({
    defaultValues: { age: 0 },
    validators: {
      onChange: z.object({ age: z.number().min(12) }),
    },
    onSubmit() {
      alert('Submitted!')
    },
    onSubmitInvalid() {
      requestAnimationFrame(() => {
        formElement.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"]',
        )?.focus()
      })
    },
  })

  <form
    ref={formElement}
    onSubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <form.Field
      name="age"
      children={(field) => <label>
        Age
        <input
          name={field.name}
          type="number"
          value={field.state.value}
          aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(
            event.currentTarget.valueAsNumber,
          )}
        />
      </label>}
    />
    <button type="submit">Submit</button>
  </form>
}
```

The animation frame lets Octane commit the validation state to the DOM before checking `aria-invalid`. DOM order determines which invalid input receives focus.

## Managing input refs directly

For a custom input or a more specific focus order, keep refs to the focusable elements and inspect the corresponding field metadata. You can pass refs directly to DOM elements; Octane does not require `forwardRef`.

```tsrx
import { useRef } from 'octane'
import { useForm } from '@tanstack/octane-form'

function App() @{
  const firstNameInput = useRef<HTMLInputElement | null>(null)
  const lastNameInput = useRef<HTMLInputElement | null>(null)
  const form = useForm({
    defaultValues: { firstName: '', lastName: '' },
    onSubmitInvalid({ formApi }) {
      if (formApi.getFieldMeta('firstName')?.isValid === false) {
        firstNameInput.current?.focus()
      } else if (formApi.getFieldMeta('lastName')?.isValid === false) {
        lastNameInput.current?.focus()
      }
    },
  })

  <form
    onSubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      void form.handleSubmit()
    }}
  >
    <form.Field
      name="firstName"
      validators={{
        onChange: ({ value }) => !value ? 'First name is required' : undefined,
      }}
      children={(field) =>
        <input
          ref={firstNameInput}
          aria-label="First name"
          value={field.state.value}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(event.currentTarget.value)}
        />}
    />
    <form.Field
      name="lastName"
      validators={{
        onChange: ({ value }) => !value ? 'Last name is required' : undefined,
      }}
      children={(field) =>
        <input
          ref={lastNameInput}
          aria-label="Last name"
          value={field.state.value}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(event.currentTarget.value)}
        />}
    />
    <button type="submit">Submit</button>
  </form>
}
```

For a reusable custom input, accept a `ref` prop and pass it to the underlying input, or expose a focus method with Octane's `useImperativeHandle`.
