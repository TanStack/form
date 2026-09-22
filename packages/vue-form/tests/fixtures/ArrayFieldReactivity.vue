<script setup lang="ts">
import { useForm } from '../../src'
import ArrayFieldControl from './ArrayFieldControl.vue'

const props = defineProps<{ validate: () => Promise<string> }>()
const form = useForm({ defaultValues: { items: ['First'] } })
</script>

<template>
  <form.ArrayField
    name="items"
    :validators="[{ triggers: ['change'], run: () => props.validate() }]"
    v-slot="{ field }"
  >
    <ArrayFieldControl :field="field" />
  </form.ArrayField>
</template>
