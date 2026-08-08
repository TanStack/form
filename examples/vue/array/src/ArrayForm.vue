<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

const props = defineProps<{ items: Array<string> }>()

const form = useForm({
  defaultValues: {
    items: props.items,
  },
  onSubmit: ({ value }) => {
    console.log(value)
    alert(`Submitted ${value.items.length} items.`)
  },
})
</script>

<template>
  <form.Subscribe
    :selector="(state) => state.values.items.length"
    v-slot="amount"
  >
    <h2>Item amount: {{ amount.toLocaleString() }}</h2>
  </form.Subscribe>

  <form @submit.prevent.stop="form.handleSubmit()">
    <button type="submit">Submit</button>
    <button type="button" @click="form.pushFieldValue('items', 'New Field')">
      Create item
    </button>

    <!-- ArrayField only rerenders this list when its structure changes. -->
    <form.ArrayField name="items" v-slot="{ field: array }">
      <ul>
        <li v-for="(_, index) in array.value" :key="index">
          <form.Field :name="`items[${index}]`" v-slot="{ field }">
            <label>
              <span>Field {{ index }}</span>
              <input
                :name="field.name"
                :value="field.value"
                @blur="field.handleBlur"
                @input="
                  field.handleChange(($event.target as HTMLInputElement).value)
                "
              />
            </label>
          </form.Field>
        </li>
      </ul>
    </form.ArrayField>
  </form>
</template>
