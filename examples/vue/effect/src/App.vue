<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import FieldInfo from './FieldInfo.vue'
import { effectValidator } from '@tanstack/effect-form-adapter'
import { Schema } from "@effect/schema"

const Person = Schema.Struct({
  firstName: Schema.String.pipe(Schema.minLength(3)),
  lastName: Schema.String.pipe(Schema.minLength(3)),
})

const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
    alert(JSON.stringify(value))
  },
  // Add a validator to support Effect Schema usage in Form and Field
  validatorAdapter: effectValidator,
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
      <!-- Ignore errors in form.Field temporary due to a bug in Vue:-->
      <!-- https://github.com/vuejs/language-tools/issues/3782 -->
      <!-- @vue-ignore -->
      <form.Field
        name="firstName"
        :validators="{
          onChange: Person.fields.firstName,
        }"
      >
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">First Name:</label>
          <input
            :id="field.name"
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
      <form.Field name="lastName" :validators="{
        onChange: Person.fields.lastName
      }">
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Last Name:</label>
          <input
            :id="field.name"
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
