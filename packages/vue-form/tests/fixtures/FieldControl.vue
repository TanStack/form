<script setup lang="ts">
import { onMounted } from 'vue'
import type { FieldWithValue } from '../../src'

const props = defineProps<{
  field: FieldWithValue<string>
  onMount: () => void
}>()

// Public field methods can be captured once and still target the current field.
const { handleChange, handleBlur } = props.field
onMounted(props.onMount)
</script>

<template>
  <input
    aria-label="Value"
    :value="field.value"
    @input="handleChange(($event.target as HTMLInputElement).value)"
    @blur="handleBlur"
  />
  <output data-testid="name">{{ field.name }}</output>
  <output data-testid="value">{{ field.value }}</output>
  <output data-testid="errors">{{
    field.errors.map((error) => error.message).join(',')
  }}</output>
  <output data-testid="meta-errors">{{
    field.meta.errors.map((error) => error.message).join(',')
  }}</output>
  <output data-testid="touched">{{ field.meta.isTouched }}</output>
  <output data-testid="validating">{{ field.meta.isValidating }}</output>
</template>
