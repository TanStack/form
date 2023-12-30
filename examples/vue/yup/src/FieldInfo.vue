<script setup lang="ts">
import { FieldApi } from '@tanstack/vue-form'

const props = defineProps<{
  state: FieldApi<any, any, any, any>['state']
}>()
</script>

<template>
  <em v-for="error of props.state.meta.touchedErrors">{{ error }}</em>
  {{ props.state.meta.isValidating ? 'Validating...' : null }}
</template>
