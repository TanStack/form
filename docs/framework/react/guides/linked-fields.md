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
To do this, you can add an `onChangeListenTo` prop to the `confirm_password` field.

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

This is similar to the `onBlurListenTo` prop, which re-runs the validation when the linked field is blurred.

## Linking a dynamic validator

If you validate through [`onDynamic`](./dynamic-validation.md), use `onDynamicListenTo` instead. It names the fields whose
changes should re-run this field's `onDynamic` and `onDynamicAsync` validators, so you do not have to duplicate the
rule into an `onChange` validator just to get it linked.

```tsx
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
  {/* ... */}
</form.Field>
```

Errors raised this way are stored under the `onDynamic` key of the field's error map, the same key the field's own
`onDynamic` validator writes to, so a single rule reports through one channel no matter which field triggered it.

> [!NOTE]
> A linked `onDynamic` validator runs whenever the listened-to field changes or blurs. Unlike the field's own
> `onDynamic` validator, it does not currently consult the form's `validationLogic` first, so `revalidateLogic()` will
> not hold it back before the first submission.
