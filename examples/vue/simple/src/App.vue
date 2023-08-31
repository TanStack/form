<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import FieldInfo from './FieldInfo.vue'

const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  onSubmit: async (values) => {
    // Do something with form data
    alert(values)
  },
})

async function onChangeFirstName(value) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return value.includes(`error`) && `No 'error' allowed in first name`
}
</script>

<template>
  <form.Provider>
    <form v-bind="form.getFormProps()">
      <div>
        <form.Field
          name="firstName"
          :onChange="
            (value) =>
              !value
                ? `A first name is required`
                : value.length < 3
                ? `First name must be at least 3 characters`
                : undefined
          "
          :onChangeAsyncDebounceMs="500"
          :onChangeAsync="onChangeFirstName"
        >
          <template v-slot="field">
            <label :htmlFor="field.name">First Name:</label>
            <input :name="field.name" v-bind="field.getInputProps()" />
            <FieldInfo :field="field" />
          </template>
        </form.Field>
      </div>
      <div>
        <form.Field name="lastName">
          <template v-slot="field">
            <label :htmlFor="field.name">Last Name:</label>
            <input :name="field.name" v-bind="field.getInputProps()" />
            <FieldInfo :field="field" />
          </template>
        </form.Field>
      </div>
      <form.Subscribe
        :selector="(state) => [state.canSubmit, state.isSubmitting]"
      >
        <template v-slot="[canSubmit, isSubmitting]">
          <button type="submit" :disabled="!canSubmit">
            {{ isSubmitting ? '...' : 'Submit' }}
          </button>
        </template>
      </form.Subscribe>
    </form>
  </form.Provider>
</template>
