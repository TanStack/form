<script setup lang="ts">
import { FieldApi } from '@tanstack/vue-form'

const props = defineProps<{
  field: FieldApi<any, any>
}>()
</script>

<template>
  <em v-if="field.state.meta.touchedError">{{
    field.state.meta.touchedError
  }}</em>
  {{ field.state.meta.isValidating ? 'Validating...' : null }}
</template>
