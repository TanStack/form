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

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

const form = useForm(() => ({
  defaultValues: {
    password: '',
    confirm_password: '',
  },
  // ...
}))
</script>

<template>
  <div>
    <form @submit.prevent.stop="form.handleSubmit">
      <div>
        <form.Field name="password">
          <template v-slot="{ field, value }">
            <div>Password:</div>
            <input
              :value="value()"
              @input="
                (e) => field.handleChange((e.target as HTMLInputElement).value)
              "
            />
          </template>
        </form.Field>
        <form.Field
          name="confirm_password"
          :validators="{
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) => {
              if (value !== fieldApi.form.getFieldValue('password')) {
                return 'Passwords do not match'
              }
              return undefined
            },
          }"
        >
          <template v-slot="{ field, value, meta }">
            <div>Confirm Password:</div>
            <input
              :value="value()"
              @input="
                (e) => field.handleChange((e.target as HTMLInputElement).value)
              "
            />
            <div v-for="(err, index) in meta().errors" :key="index">
              {{ err }}
            </div>
          </template>
        </form.Field>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
```

This similarly works with `onBlurListenTo` property, which will re-run the validation when the field is blurred.
