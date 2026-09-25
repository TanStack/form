<script setup lang="ts">
import type { FieldWithValue } from '../../src'

defineProps<{ field: FieldWithValue<Array<string>> }>()
</script>

<template>
  <button @click="field.pushValue('Next')">Add item</button>
  <output data-testid="length">{{ field.value.length }}</output>
  <output data-testid="validating">{{ field.meta.isValidating }}</output>
  <output data-testid="errors">{{
    field.errors.map((error) => error.message).join(',')
  }}</output>
</template>
