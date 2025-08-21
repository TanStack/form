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

## Dynamic Validation with onDynamicListenTo

For more advanced use cases where you need dynamic validation that responds to field changes but follows React Hook Form-like behavior, you can use `onDynamicListenTo` with `onDynamic` validators.

The `onDynamicListenTo` property works similarly to `onChangeListenTo` and `onBlurListenTo`, but it's specifically designed for dynamic validation scenarios where you want more control over when validation occurs.

```tsx
function App() {
  const form = useForm({
    defaultValues: {
      password: '',
      confirm_password: '',
    },
    validationLogic: revalidateLogic(),
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
          onDynamicListenTo: ['password'],
          onDynamic: ({ value, fieldApi }) => {
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

### Key Differences

- **onChangeListenTo**: Runs validation immediately when the listened field changes
- **onBlurListenTo**: Runs validation when the listened field is blurred  
- **onDynamicListenTo**: Runs validation based on the form's validation logic (typically used with `revalidateLogic` for React Hook Form-like behavior)

### Multiple Field Listening

You can listen to multiple fields by providing an array

```tsx
<form.Field
  name="dependent_field"
  validators={{
    onDynamicListenTo: ['field1', 'field2', 'field3'],
    onDynamic: ({ value, fieldApi }) => {
      // Validation logic that depends on multiple fields
      const field1Value = fieldApi.form.getFieldValue('field1')
      const field2Value = fieldApi.form.getFieldValue('field2')
      const field3Value = fieldApi.form.getFieldValue('field3')
      
      if (field1Value && field2Value && field3Value && !value) {
        return 'This field is required when all other fields have values'
      }
      return undefined
    },
  }}
>
</form.Field>
```
