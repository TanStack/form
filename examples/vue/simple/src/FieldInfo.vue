<script setup lang="ts">
import { FieldApi } from '@tanstack/vue-form'

const props = defineProps<{
  field: FieldApi<any, any>
}>()
</script>

<template>
  <em v-if="props.field.state.meta.touchedError">{{
    props.field.state.meta.touchedError
  }}</em>
  {{ props.field.state.meta.isValidating ? 'Validating...' : null }}
</template>
