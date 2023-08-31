<script setup lang="ts">
import { FieldApi } from '@tanstack/vue-form'

const props = defineProps<{
  state: FieldApi<any, any>['state']
}>()
</script>

<template>
  <em v-if="props.state.meta.touchedError">{{
    props.state.meta.touchedError
  }}</em>
  {{ props.state.meta.isValidating ? 'Validating...' : null }}
</template>
