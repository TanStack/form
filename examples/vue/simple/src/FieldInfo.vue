<script setup lang="ts">
import type { AnyFieldApi } from '@tanstack/vue-form'

defineProps<{ field: AnyFieldApi }>()
</script>

<template>
  <template v-if="field.meta.isTouched && field.meta.isInvalid">
    <em role="alert">
      {{ field.errors.map((error) => error.message).join(', ') }}
    </em>
  </template>
  <span v-if="field.meta.isValidating" aria-live="polite"> Validating... </span>
</template>
