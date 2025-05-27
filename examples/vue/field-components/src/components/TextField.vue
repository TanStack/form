<script setup lang="ts">
import { useStore } from '@tanstack/vue-form'
import { injectField } from '../compositions/form-providers'

const props = defineProps(['label'])

const field = injectField<string>()

const errors = useStore(field.store, (state) => state.meta.errors)
</script>

<template>
  <div>
    <label>
      <div>{{ props.label }}</div>
      <input
        :value="field.state.value"
        @input="field.handleChange(($event as any).target.value)"
      />
    </label>
    <div v-for="error in errors" :key="error" style="color: red">
      {{ error }}
    </div>
  </div>
</template>
