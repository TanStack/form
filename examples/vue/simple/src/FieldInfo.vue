<script setup lang="ts">
import { AnyFieldApi } from '@tanstack/vue-form'

const props = defineProps<{
  state: AnyFieldApi['state']
}>()
</script>

<template>
  <template v-if="props.state.meta.isTouched">
    <em v-for="error of props.state.meta.errors">{{ error }}</em>
    {{ props.state.meta.isValidating ? 'Validating...' : null }}
  </template>
</template>
