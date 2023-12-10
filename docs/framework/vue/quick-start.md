---
id: quick-start
title: Quick Start
---

> There is a bug in Vue's TypeScript support that's impacting our types that you'll likely run into: 
>
> https://github.com/vuejs/language-tools/issues/3782
>
> Please give it a thumbs up, but _do not reply with comments such as "+1" or "When will this be fixed?", as such comments are unhelpful and rude_. 

The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

```vue
<!-- App.vue -->
<script setup>
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    fullName: '',
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
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

