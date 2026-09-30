---
id: linked-fields
title: Link Two Form Fields Together
---

You may find yourself needing to link two fields together, such that one is validated when another's value has changed.
One such use case is when you have both a `password` and a `confirm_password` field.
Here, you want the `confirm_password` field to error out if its value doesn't match that of the `password` field, regardless of which field triggered the value change.

Imagine the following user flow:

- User updates the `confirm_password` field.
- User updates the `password` field.

In this example, the form will still have errors present because the `confirm_password` field's validation has not been re-run to mark the field as valid.

To solve this, you need to make sure that the `confirm_password` field's validation is re-run when the `password` field is updated.
To do this, add `onChangeListenTo` to the `confirm_password` field's `validators` option. In Octane, use the native `onInput` event to update text fields at each keystroke.

```tsrx
import { useForm } from '@tanstack/octane-form'

function App() @{
  const form = useForm({
    defaultValues: {
      password: '',
      confirm_password: '',
    },
    // ...
  })

  <div>
    <form.Field
      name="password"
      children={(field) => <label>
        <div>Password</div>
        <input
          value={field.state.value}
          onInput={(e) => field.handleChange(e.currentTarget.value)}
        />
      </label>}
    />
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
      children={(field) => <div>
        <label>
          <div>Confirm Password</div>
          <input
            value={field.state.value}
            onInput={(e) => field.handleChange(e.currentTarget.value)}
          />
        </label>
        @for (const error of field.state.meta.errors; index i; key i) {
          <div>{error}</div>
        }
      </div>}
    />
  </div>
}
```

This is similar to the `onBlurListenTo` validator option, which re-runs the validation when the linked field is blurred. Wire `onBlur={field.handleBlur}` on each input when using blur validation.
