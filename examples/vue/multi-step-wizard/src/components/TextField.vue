<script setup lang="ts">
import type { FieldWithValue } from '@tanstack/vue-form'

defineProps<{
  field: FieldWithValue<string>
  label: string
}>()
</script>

<template>
  <div>
    <label :for="field.name">{{ label }}</label>
    <input
      :id="field.name"
      :name="field.name"
      :value="field.value"
      :aria-invalid="field.meta.isInvalid"
      @input="field.handleChange(($event.target as HTMLInputElement).value)"
      @blur="field.handleBlur"
    />
    <div
      v-for="error in field.errors"
      :key="error.message"
      role="alert"
      style="color: red"
    >
      {{ error.message }}
    </div>
  </div>
</template>
