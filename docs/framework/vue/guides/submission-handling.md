---
id: submission-handling
title: Submission handling
---

## Passing additional data to submission handling

You may want to pass additional information to your submission handler, for example, which section to navigate to.
To pass meta data to `onSubmit`, you can make use of the `onSubmitMeta` property.

> Note: if `form.handleSubmit()` is called without metadata, it will use the provided default.

```vue
<script setup lang="ts">
const form = useForm({
  defaultValues: {
    firstName: 'Rick',
  },
  // Specify what values to use as default if no meta is passed
  onSubmitMeta: { lastName: 'The default value if no submit Meta is passed' },
  onSubmit: async ({ value, meta }) => {
    // Do something with the values passed via handleSubmit
    console.log(`${value.firstName} - ${meta.lastName}`)
  },
})
</script>

<template>
  <form
    @submit.prevent.stop="
      () => {
        // Overwrites the default specified in onSubmitMeta
        form.handleSubmit({
          lastName: 'Astley',
        })

        // form.handleSubmit() would use the default meta
      }
    "
  >
    <!-- ... -->
  </form>
</template>
```

## Transforming data with Standard Schemas

While Tanstack Form provides Standard Schema support for validation, it does not preserve the Schema's output data.

The value passed to the `onSubmit` function will always be the input data. To receive the output data of a Standard Schema, parse it in the `onSubmit` function:

```vue
<script setup lang="ts">
import { z } from 'zod'
import { useForm } from '@tanstack/vue-form'

const schema = z.object({
  age: z.string().transform((age) => Number(age)),
})

// Tanstack form uses the input type of Standard Schemas
const defaultValues: z.input<typeof schema> = {
  age: '13',
}

const form = useForm({
  defaultValues,
  validators: {
    onChange: schema,
  },
  onSubmit: ({ value }) => {
    const inputAge: string = value.age
    // Pass it through the schema to get the transformed value
    const result = schema.parse(value)
    const outputAge: number = result.age
  },
})
</script>
<template>
  <!-- ... -->
</template>
```
