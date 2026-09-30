---
id: listeners
title: Side effects for event triggers
---

Use the listener API to run side effects in response to form events. For example, you might need to reset a field when another field changes.

Imagine the following user flow:

- The user selects a country.
- The user selects a province.
- The user changes the country.

The previously selected province may no longer be valid. A field's `onChange` listener can reset it whenever the country changes.

Fields support listeners for:

- `onChange`
- `onBlur`
- `onMount`
- `onSubmit`
- `onUnmount`

```tsrx
import { useForm } from '@tanstack/octane-form'

function App() @{
  const form = useForm({
    defaultValues: {
      country: '',
      province: '',
    },
  })

  <div>
    <form.Field
      name="country"
      listeners={{
        onChange: ({ value }) => {
          console.log(`Country changed to: ${value}, resetting province`)
          form.setFieldValue('province', '')
        },
      }}
      children={(field) => <label>
        Country
        <input
          value={field.state.value}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(event.currentTarget.value)}
        />
      </label>}
    />
    <form.Field
      name="province"
      children={(field) => <label>
        Province
        <input
          value={field.state.value}
          onBlur={field.handleBlur}
          onInput={(event) => field.handleChange(event.currentTarget.value)}
        />
      </label>}
    />
  </div>
}
```

`onChange` here is a TanStack Form listener, fired by `field.handleChange`. The native text input uses Octane's `onInput` handler so that the listener runs for each edit.

## Built-in Debouncing

When a listener makes an API request or performs expensive work, use `onChangeDebounceMs` or `onBlurDebounceMs` to debounce its calls.

```tsrx
<form.Field
  name="country"
  listeners={{
    onChangeDebounceMs: 500,
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value} without another edit for 500ms`)
      form.setFieldValue('province', '')
    },
  }}
  children={(field) =>
    <input
      value={field.state.value}
      onBlur={field.handleBlur}
      onInput={(event) => field.handleChange(event.currentTarget.value)}
    />}
/>
```

## Form listeners

Form-level listeners provide access to `onMount` and `onSubmit`, and receive `onChange` and `onBlur` events from the form's fields. You can also debounce form-level change and blur listeners.

`onMount` and `onSubmit` listeners receive `formApi`. `onChange` and `onBlur` listeners receive both `formApi` and the `fieldApi` that triggered the event.

```ts
const form = useForm({
  defaultValues: { country: '', province: '' },
  onSubmit: async ({ value }) => {
    // Save the form values.
    console.log(value)
  },
  listeners: {
    onMount: ({ formApi }) => {
      console.log('Form mounted', formApi.state.values)
    },
    onChange: ({ formApi, fieldApi }) => {
      if (formApi.state.isValid) {
        void formApi.handleSubmit()
      }
      console.log(fieldApi.name, fieldApi.state.value)
    },
    onChangeDebounceMs: 500,
  },
})
```

Listeners are for event-driven side effects. To display current values or metadata in your template, use the subscriptions described in [Reactivity](./reactivity.md).
