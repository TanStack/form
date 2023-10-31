---
id: quick-start
title: Quick Start
---

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```vue
<!-- App.vue -->
<script setup>
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    fullName: '',
  },
  onSubmit: async (values) => {
    // Do something with form data
    console.log(values)
  },
})

form.provideFormContext()
</script>

<template>
  <div>
    <div>
      <form.Field name="fullName">
        <template v-slot="{ field }">
          <input
            :name="field.name"
            :value="field.state.value"
            :onBlur="field.handleBlur"
            :onChange="(e) => field.handleChange(e.target.value)"
          />
        </template>
      </form.Field>
    </div>
    <button type="submit">Submit</button>
  </div>
</template>
```

From here, you'll be ready to explore all of the other features of TanStack Form!
