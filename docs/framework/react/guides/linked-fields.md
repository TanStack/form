---
id: linked-fields
title: Link Two Form Fields Together
---

You may find yourself needing to link two fields together; when one is validated as another field's value has changed.
One such usage is when you have both a `password` and `confirm_password` field,
where you want to `confirm_password` to error out when `password`'s value does not match;
regardless of which field triggered the value change.

Imagine the following userflow:

- User updates confirm password field.
- User updates the non-confirm password field.

In this example, the form will still have errors present,
as the "confirm password" field validation has not been re-ran to mark as accepted.

To solve this, we need to make sure that the "confirm password" validation is re-run when the password field is updated.
To do this, you can add a `onChangeListenTo` property to the `confirm_password` field.

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      password: '',
      confirm_password: '',
    },
    // ...
  })

  return (
    <div>
      <form.Field name="password">
        {(field) => (
          <label>
            <div>Password</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>
      <form.Field
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
        {(field) => (
          <div>
            <label>
              <div>Confirm Password</div>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
            {field.state.meta.errors.map((err) => (
              <div key={err}>{err}</div>
            ))}
          </div>
        )}
      </form.Field>
    </div>
  )
}
```

This similarly works with `onBlurListenTo` property, which will re-run the validation when the field is blurred.
