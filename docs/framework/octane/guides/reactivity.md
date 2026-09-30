---
id: reactivity
title: Reactivity
---

Reading `form.state` gives you the current state, but it does not subscribe an Octane component to later changes. The Octane adapter provides `useSelector` and `form.Subscribe` to create those subscriptions.

Use subscriptions to display current values, select UI based on field values, or use form state in component logic. The `form.Field` component already subscribes to its own field state, so reading `field.state` inside its render callback updates the field's UI.

> To run side effects in response to form events, use the [listener](./listeners.md) API.

## useSelector

Import `useSelector` from `@tanstack/octane-form` to select a value from the form store. The hook subscribes the component that calls it to changes in that selected value.

```tsrx
import { useForm, useSelector } from '@tanstack/octane-form'

function App() @{
  const form = useForm({
    defaultValues: { firstName: '', lastName: '' },
  })
  const firstName = useSelector(form.store, (state) => state.values.firstName)
  const errors = useSelector(form.store, (state) => state.errors)

  <div>
    <form.Field
      name="firstName"
      children={(field) =>
        <input
          value={field.state.value}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(event.currentTarget.value)}
        />}
    />
    <p>Hello, {firstName || 'stranger'}!</p>
    <p>Form errors: {errors.length}</p>
  </div>
}
```

The selector is optional, but selecting only the state you use avoids updates caused by unrelated changes. `useSelector(form.store)` subscribes to the entire form state.

The hook is re-exported from `@tanstack/octane-store` and compares selected values by identity by default. Prefer selecting a primitive or an existing state object. If your selector creates a new object or array, provide an appropriate `compare` function when you need to avoid updates for equivalent selections.

```ts
const status = useSelector(
  form.store,
  (state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting }),
  {
    compare: (previous, next) =>
      previous.canSubmit === next.canSubmit &&
      previous.isSubmitting === next.isSubmitting,
  },
)
```

## form.Subscribe

Use `form.Subscribe` when the selected value is needed only within part of your template. Updates to its selection update the subscription component and its rendered content without requiring the containing component to subscribe to that state.

```tsrx
<form.Subscribe
  selector={(state) => state.values.firstName}
  children={(firstName) => <div>
    @if (firstName) {
      <form.Field
        name="lastName"
        children={(field) => <label>
          Last name for
          {firstName}
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onInput={(event) => field.handleChange(event.currentTarget.value)}
          />
        </label>}
      />
    } @else {
      <p>Enter your first name to continue.</p>
    }
  </div>}
/>
```

Pass the render callback explicitly through `children={...}` in TSRX. You can select submission state in the same way:

```tsrx
<form.Subscribe
  selector={(state) => state.isSubmitting}
  children={(isSubmitting) => <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Saving...' : 'Save'}
  </button>}
/>
```

Choose `useSelector` when you need the selected value in component logic, and `form.Subscribe` when you can keep the subscription beside the UI that consumes it. Octane's compiler optimizes rendering, but it still needs a subscription to observe changes to TanStack Form's external store.
