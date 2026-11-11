<script setup lang="ts">
import type { FieldWithValue } from '../../src'

defineProps<{ field: FieldWithValue<string>; itemId: string }>()
</script>

<template>
  <input
    :aria-label="itemId"
    :name="field.name"
    :value="field.value"
    @input="field.handleChange(($event.target as HTMLInputElement).value)"
  />
  <output :data-testid="`name-${itemId}`">{{ field.name }}</output>
</template>
