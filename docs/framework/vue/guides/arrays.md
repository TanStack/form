---
id: arrays
title: Arrays
---

TanStack Form supports arrays as values in a form, including sub-object values inside of an array.

## Basic Usage

To use an array, you can use `field.state.value` on an array value in conjunction
with [`Index` from `solid-js`](https://www.solidjs.com/tutorial/flow_index):

```vue
<script setup lang="ts">
  import { useForm } from '@tanstack/vue-form'

  const form = useForm({
    defaultValues: {
      people: [] as Array<{ age: number; name: string }>,
    },
    onSubmit: ({ value }) => alert(JSON.stringify(value)),
  })
</script>

<template>
  <form.Field name="people">
    <template v-slot="{ field, state }">
      <div>
        <form.Field
          v-for="(_, i) of field.state.value"
          :key="i"
          :name="`people[${i}].name`"
        >
          <template v-slot="{ field: subField, state }">
            <!-- ... -->
          </template>
        </form.Field>
      </div>
    </template>
  </form.Field>
</template>
```

This will generate the mapped slot every time you run `pushValue` on `field`:

```vue
<button
  @click="field.pushValue({ name: '', age: 0 })"
  type="button"
>
  Add person
</button>
```

Finally, you can use a subfield like so:

```vue
<form.Field
  v-for="(_, i) of field.state.value"
  :key="i"
  :name="`people[${i}].name`"
>
  <template v-slot="{ field: subField, state }">
    <div>
      <label>
        <div>Name for person {{ i }}</div>
        <input
          :value="subField.state.value"
          @input="
          (e) =>
          subField.handleChange(
            (e.target as HTMLInputElement).value,
          )
          "
        />
      </label>
    </div>
  </template>
</form.Field>
```

## Full Example

```vue
<script setup lang="ts">
  import { useForm } from '@tanstack/vue-form'

  const form = useForm({
    defaultValues: {
      people: [] as Array<{ age: number; name: string }>,
    },
    onSubmit: ({ value }) => alert(JSON.stringify(value)),
  })
</script>

<template>
  <form
    @submit="
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }
    "
  >
    <div>
      <form.Field name="people">
        <template v-slot="{ field, state }">
          <div>
            <form.Field
              v-for="(_, i) of field.state.value"
              :key="i"
              :name="`people[${i}].name`"
            >
              <template v-slot="{ field: subField, state }">
                <div>
                  <label>
                    <div>Name for person {{ i }}</div>
                    <input
                      :value="subField.state.value"
                      @input="
                        (e) =>
                          subField.handleChange(
                            (e.target as HTMLInputElement).value,
                          )
                      "
                    />
                  </label>
                </div>
              </template>
            </form.Field>

            <button
              @click="field.pushValue({ name: '', age: 0 })"
              type="button"
            >
              Add person
            </button>
          </div>
        </template>
      </form.Field>
    </div>
    <form.Subscribe>
      <template v-slot="{ canSubmit, isSubmitting }">
        <button type="submit" :disabled="!canSubmit">
          {{ isSubmitting ? '...' : 'Submit' }}
        </button>
      </template>
    </form.Subscribe>
  </form>
</template>
```
