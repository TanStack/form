---
id: listeners
title: Side effects for event triggers
---

For situations where you want to "affect" or "react" to triggers, there's the listener API. For example, if you, as the developer, want to reset a form field as a result of another field changing, you would use the listener API.

Imagine the following user flow:

- User selects a country from a drop-down.
- User then selects a county from another drop-down.
- User changes the selected country to a different one.

In this example, when the user changes the country, the selected county needs to be reset as it's no longer valid. With the listener API, we can subscribe to the onChange event and dispatch a reset to the field "county" when the listener is fired.

Other events that can be "listened" to are:

- onChange
- onBlur
- onMount
- onSubmit

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      country: '',
      county: '',
    },
    // ...
  })

  return (
    <div>
      <form.Field name="country">
        {(field) => (
          <label>
            <div>Country</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              listener={{
                onChange: ({ value }) => {
                  form.reset({county: ''})
                }
              }}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="county">
        {(field) => (
          <label>
            <div>County</div>
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
