<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import FieldInfo from './FieldInfo.vue'
import { yupValidator } from '@tanstack/yup-form-adapter'
import * as yup from 'yup'

const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  onSubmit: async (values) => {
    // Do something with form data
    alert(JSON.stringify(values))
  },
  // Add a validator to support Yup usage in Form and Field
  validator: yupValidator,
})

form.provideFormContext()

const onChangeFirstName = yup
  .string()
  .test('no-error', "No 'error' allowed in first name", async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return !value?.includes('error')
  })
</script>

<template>
  <form
    @submit="
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }
    "
  >
    <div>
      <form.Field
        name="firstName"
        :onChange="
          yup.string().min(3, 'First name must be at least 3 characters')
        "
        :onChangeAsyncDebounceMs="500"
        :onChangeAsync="onChangeFirstName"
      >
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">First Name:</label>
          <input
            :name="field.name"
            :value="field.state.value"
            @input="
              (e) => field.handleChange((e.target as HTMLInputElement).value)
            "
            @blur="field.handleBlur"
          />
          <FieldInfo :state="state" />
        </template>
      </form.Field>
    </div>
    <div>
      <form.Field name="lastName">
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Last Name:</label>
          <input
            :name="field.name"
            :value="field.state.value"
            @input="
              (e) => field.handleChange((e.target as HTMLInputElement).value)
            "
            @blur="field.handleBlur"
          />
          <FieldInfo :state="state" />
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