<script setup lang="ts">
import type { AnyFieldApi } from '@tanstack/vue-form'

defineProps<{ field: AnyFieldApi }>()
</script>

<template>
  <small :role="field.meta.isInvalid ? 'alert' : undefined" aria-live="polite">
    {{ field.errors.map((error) => error.message).join('\n') }}
  </small>
</template>
