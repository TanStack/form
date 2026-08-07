<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import FieldInfo from './FieldInfo.vue'

const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value)
  },
})

async function validateFirstName({ value }: { value: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return value.includes('error') && 'No "error" allowed in first name'
}
</script>

<template>
  <div>
    <h1>Simple Form Example</h1>
    <form @submit.prevent.stop="form.handleSubmit()">
      <div>
        <form.Field
          name="firstName"
          :validators="[
            {
              run: ({ value }) =>
                !value
                  ? 'A first name is required'
                  : value.length < 3
                    ? 'First name must be at least 3 characters'
                    : undefined,
              triggers: ['change'],
            },
            {
              run: validateFirstName,
              triggers: ['change'],
              triggerDebounceMs: 500,
            },
          ]"
          v-slot="{ field }"
        >
          <label :for="field.name">First Name:</label>
          <input
            :id="field.name"
            :name="field.name"
            :value="field.value"
            :aria-invalid="field.meta.isInvalid"
            @blur="field.handleBlur"
            @input="
              field.handleChange(($event.target as HTMLInputElement).value)
            "
          />
          <FieldInfo :field="field" />
        </form.Field>
      </div>

      <div>
        <form.Field name="lastName" v-slot="{ field }">
          <label :for="field.name">Last Name:</label>
          <input
            :id="field.name"
            :name="field.name"
            :value="field.value"
            :aria-invalid="field.meta.isInvalid"
            @blur="field.handleBlur"
            @input="
              field.handleChange(($event.target as HTMLInputElement).value)
            "
          />
          <FieldInfo :field="field" />
        </form.Field>
      </div>

      <form.Subscribe
        :selector="(state) => [state.canSubmit, state.isSubmitting] as const"
        v-slot="[canSubmit, isSubmitting]"
      >
        <button type="submit" :disabled="!canSubmit">
          {{ isSubmitting ? '...' : 'Submit' }}
        </button>
        <button type="reset" @click.prevent="form.reset()">Reset</button>
      </form.Subscribe>
    </form>
  </div>
</template>
