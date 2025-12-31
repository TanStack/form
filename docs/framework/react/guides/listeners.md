---
id: listeners
title: Side effects for event triggers
---

For situations where you want to "affect" or "react" to triggers, there's the listener API. For example, if you, as the developer, want to reset a form field as a result of another field changing, you would use the listener API.

Imagine the following user flow:

- User selects a country from a drop-down.
- User then selects a province from another drop-down.
- User changes the selected country to a different one.

In this example, when the user changes the country, the selected province needs to be reset as it's no longer valid. With the listener API, we can subscribe to the `onChange` event and dispatch a reset to the "province" field when the listener is fired.

Events that can be "listened" to are:

- `onChange`
- `onBlur`
- `onMount`
- `onSubmit`

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      country: '',
      province: '',
    },
    // ...
  })

  return (
    <div>
      <form.Field
        name="country"
        listeners={{
          onChange: ({ value }) => {
            console.log(`Country changed to: ${value}, resetting province`)
            form.setFieldValue('province', '')
          },
        }}
      >
        {(field) => (
          <label>
            <div>Country</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="province">
        {(field) => (
          <label>
            <div>Province</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>
    </div>
  )
}
```

### Built-in Debouncing

If you are making an API request inside a listener, you may want to debounce the calls as it can lead to performance issues.
We enable an easy method for debouncing your listeners by adding a `onChangeDebounceMs` or `onBlurDebounceMs`.

```tsx
<form.Field
  name="country"
  listeners={{
    onChangeDebounceMs: 500, // 500ms debounce
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value} without a change within 500ms, resetting province`)
      form.setFieldValue('province', '')
    },
  }}
>
  {(field) => (
    /* ... */
  )}
</form.Field>
```

### Form listeners

At a higher level, listeners are also available at the form level, allowing you access to the `onMount` and `onSubmit` events, and having `onChange` and `onBlur` propagated to all the form's children. Form-level listeners can also be debounced in the same way as previously discussed.

`onMount` and `onSubmit` listeners have the following parameters:

- `formApi`

`onChange` and `onBlur` listeners have access to:

- `fieldApi`
- `formApi`

```tsx
const form = useForm({
  listeners: {
    onMount: ({ formApi }) => {
      // custom logging service
      loggingService('mount', formApi.state.values)
    },

    onChange: ({ formApi, fieldApi }) => {
      // autosave logic
      if (formApi.state.isValid) {
        formApi.handleSubmit()
      }

      // fieldApi represents the field that triggered the event.
      console.log(fieldApi.name, fieldApi.state.value)
    },
    onChangeDebounceMs: 500,
  },
})
```
