<script setup lang="ts">
import { injectForm } from '../compositions/form-providers'

const props = defineProps(['label'])

const form = injectForm()
</script>

<template>
  <form.Subscribe :selector="(state) => state.isSubmitting">
    <template v-slot="isSubmitting">
      <button :disabled="isSubmitting">{{ props.label }}</button>
    </template>
  </form.Subscribe>
</template>
