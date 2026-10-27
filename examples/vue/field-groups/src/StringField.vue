<script setup lang="ts">
import FieldError from './FieldError.vue'
import type { FieldWithValue } from '@tanstack/vue-form'

withDefaults(
  defineProps<{
    field: FieldWithValue<string>
    label: string
    type?: 'text' | 'date'
  }>(),
  { type: 'text' },
)
</script>

<template>
  <label
    :class="{ validating: field.meta.isValidating }"
    style="display: block"
  >
    <span>{{ label }}</span>
    <input
      :name="field.name"
      :type="type"
      :value="field.value"
      :aria-invalid="field.meta.isInvalid"
      @blur="field.handleBlur"
      @input="field.handleChange(($event.target as HTMLInputElement).value)"
    />
    <br />
    <FieldError :field="field" />
  </label>
</template>
