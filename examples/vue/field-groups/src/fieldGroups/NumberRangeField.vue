<script setup lang="ts">
import { LowerBoundField, UpperBoundField } from './fieldBounds'
import type { numberRange } from './definitions'

defineProps<{ fields: typeof numberRange.fields; label: string }>()
</script>

<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <!-- Pass the scoped API as form; children bind to this group's names. -->
    <LowerBoundField
      label="Minimum"
      :form="fields"
      :fields="{ value: 'minimum' }"
    />
    <UpperBoundField
      label="Maximum"
      :form="fields"
      :fields="{ value: 'maximum', lowerBound: 'minimum' }"
    />
  </fieldset>
</template>
