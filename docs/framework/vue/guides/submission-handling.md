---
id: submission-handling
title: Submission handling
---

## Passing additional data to submission handling

You may want to split your long form into multiple sections, for example, when creating a booking form.
To receive meta data in your `onSubmit` function, you can specify the `onSubmitMeta` property.

> Note: if `form.handleSubmit()` is called without metadata, it will use the provided default.

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

type FormMeta = {
  section: 'personalInfo' | 'paymentInfo' | null
}

// Metadata is not required to call form.handleSubmit().
// Specify what values to use as default if no meta is passed
const defaultMeta: FormMeta = {
  section: null,
}

const form = useForm({
  defaultValues: {
    personal: {
      name: '',
      email: '',
    },
    payment: {
      address: '',
    },
  },
  // Define what meta values to expect on submission
  onSubmitMeta: defaultMeta,
  onSubmit: async ({ value, meta }) => {
    // Do something with the values passed via handleSubmit
    console.log(`Selected section - ${meta.section}`, value)
  },
})
</script>

<template>
  <form
    @submit.prevent.stop="
      (e) => {
        // Overwrites the default specified in onSubmitMeta
        form.handleSubmit({ section: 'paymentInfo' })
      }
    "
  >
    <!-- -->
    <button type="submit">Submit Personal Info</button>
  </form>

  <form
    @submit.prevent.stop="() => form.handleSubmit({ section: 'paymentInfo' })"
  >
    <!-- -->
    <button type="submit">Submit Payment Info</button>
  </form>
</template>
```

## Transforming data with Standard Schemas

While Tanstack Form provides [Standard Schema support](./validation.md) for validation, it does not preserve the Schema's output data.

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
