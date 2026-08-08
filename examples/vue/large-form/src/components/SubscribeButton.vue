<script setup lang="ts">
import { useFormContext } from '../hooks/form.ts'

defineProps<{ label: string }>()

const form = useFormContext()
</script>

<template>
  <form.Subscribe
    :selector="(state) => state.isSubmitting"
    v-slot="isSubmitting"
  >
    <button type="submit" :disabled="isSubmitting">{{ label }}</button>
  </form.Subscribe>
</template>
