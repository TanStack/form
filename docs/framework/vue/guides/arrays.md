---
id: arrays
title: Arrays
---

TanStack Form supports arrays of simple values and objects. When you want to
treat the entire array as one field value, using `form.Field` is valid.

When each item is rendered as a separate field, wrapping the entire array in
`form.Field` means that a nested field change can rerender the whole list.

## Render an array

Use `form.ArrayField` when each item in an array is rendered as its own field.
Its slot rerenders when the array structure changes, such as when an item is
added, removed, or reordered, but not when a nested property changes.

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

function createPerson() {
  return { id: crypto.randomUUID(), name: '', age: 0 }
}

const form = useForm({
  defaultValues: {
    people: [createPerson()],
  },
  onSubmit: ({ value }) => console.log(value),
})
</script>

<template>
  <form @submit.prevent="form.handleSubmit()">
    <form.ArrayField name="people" v-slot="{ field: array }">
      <ul>
        <li v-for="(person, index) in array.value" :key="person.id">
          <form.Field :name="`people[${index}].name`" v-slot="{ field }">
            <label :for="field.name">Name</label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.value"
              @blur="field.handleBlur"
              @input="
                field.handleChange(($event.target as HTMLInputElement).value)
              "
            />
          </form.Field>

          <form.Field :name="`people[${index}].age`" v-slot="{ field }">
            <label :for="field.name">Age</label>
            <input
              :id="field.name"
              :name="field.name"
              type="number"
              :value="field.value"
              @input="
                field.handleChange(
                  ($event.target as HTMLInputElement).valueAsNumber,
                )
              "
            />
          </form.Field>

          <button type="button" @click="form.removeFieldValue('people', index)">
            Remove person
          </button>
        </li>
      </ul>
    </form.ArrayField>

    <button
      type="button"
      @click="form.pushFieldValue('people', createPerson())"
    >
      Add person
    </button>
    <button type="submit">Submit</button>
  </form>
</template>
```

## Array mutations

Perform mutations with the typed form-level helpers:

```ts
form.pushFieldValue('people', { id: 'a', name: '', age: 0 })
form.insertFieldValue('people', 1, { id: 'b', name: '', age: 0 })
form.removeFieldValue('people', 0)
form.swapFieldValues('people', 0, 1)
form.moveFieldValue('people', 2, 0)
form.filterFieldValues('people', (person) => person.age >= 18)
form.clearFieldValues('people')
```

Prefer a stable item identifier for Vue's `:key` when items can be reordered.
An index key is sufficient only when item identity does not matter.
