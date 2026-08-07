---
id: quick-start
title: Quick Start
---

TanStack Form is a headless, type-safe form library. It owns form state and
validation while leaving markup, styling, and component choice to you.

The Form v2 Vue adapter requires Vue 3.6 or newer. Vue 3.6 provides the
component and composition behavior needed to preserve form and field types
across templates and extracted components.

Install the Vue adapter:

```bash
npm install @tanstack/vue-form
```

## Create a form

`useForm` requires `defaultValues`. Their shape becomes the form's inferred
value type.

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    fullName: '',
    age: 0,
  },
  onSubmit: async ({ value }) => {
    console.log(value)
  },
})
</script>

<template>
  <form @submit.prevent="form.handleSubmit()">
    <form.Field
      name="fullName"
      :validators="[
        {
          triggers: ['change', 'blur'],
          run: ({ value }) =>
            value.trim() ? undefined : 'Enter your full name',
        },
      ]"
      v-slot="{ field }"
    >
      <label :for="field.name">Full name</label>
      <input
        :id="field.name"
        :name="field.name"
        :value="field.value"
        :aria-invalid="field.meta.isInvalid"
        @blur="field.handleBlur"
        @input="field.handleChange(($event.target as HTMLInputElement).value)"
      />
      <span v-for="error in field.errors" :key="error.message" role="alert">
        {{ error.message }}
      </span>
    </form.Field>

    <form.Field
      name="age"
      :validators="[
        {
          triggers: ['change'],
          run: ({ value }) =>
            value >= 13 ? undefined : 'You must be at least 13',
        },
      ]"
      v-slot="{ field }"
    >
      <label :for="field.name">Age</label>
      <input
        :id="field.name"
        :name="field.name"
        type="number"
        :value="field.value"
        :aria-invalid="field.meta.isInvalid"
        @blur="field.handleBlur"
        @input="
          field.handleChange(($event.target as HTMLInputElement).valueAsNumber)
        "
      />
    </form.Field>

    <form.Subscribe
      :selector="(state) => [state.canSubmit, state.isSubmitting] as const"
      v-slot="[canSubmit, isSubmitting]"
    >
      <button type="submit" :disabled="!canSubmit || isSubmitting">
        {{ isSubmitting ? 'Saving…' : 'Save' }}
      </button>
    </form.Subscribe>
  </form>
</template>
```

The important pieces are:

- `defaultValues` define the complete initial value and drive type inference.
- `form.Field` subscribes to one field. Its slot exposes `field.value`,
  `field.meta`, and event handlers.
- Validators are ordered objects with a `run` function and explicit
  `triggers`.
- `form.Subscribe` rerenders only its slot when the selected form state
  changes.
- `form.handleSubmit()` validates the form before calling `onSubmit`.
