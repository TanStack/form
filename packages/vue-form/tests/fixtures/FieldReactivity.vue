<script setup lang="ts">
import { ref } from 'vue'
import { createFormHook, getFormHookHelpers } from '../../src'
import FieldControl from './FieldControl.vue'

const props = defineProps<{
  mode: 'slot' | 'injected'
  validate: (value: string) => string | null | Promise<string | null>
  onFieldMount: () => void
}>()

const { fieldComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {
    Control: fieldComponent.strict(FieldControl, 'field'),
  },
  formComponents: {},
})
const form = useAppForm({
  defaultValues: { first: 'First', second: 'Second' },
})
const name = ref<'first' | 'second'>('first')
</script>

<template>
  <form.Field
    :name="name"
    :validators="[
      { triggers: ['change'], run: ({ value }) => props.validate(value) },
    ]"
    v-slot="{ field }"
  >
    <FieldControl
      v-if="mode === 'slot'"
      :field="field"
      :on-mount="onFieldMount"
    />
    <field.Control v-else :on-mount="onFieldMount" />
  </form.Field>
  <button @click="form.reset()">Reset</button>
  <button @click="name = 'second'">Switch field</button>
  <form.Subscribe :selector="(state) => state.values" v-slot="values">
    <output data-testid="first-value">{{ values.first }}</output>
    <output data-testid="second-value">{{ values.second }}</output>
  </form.Subscribe>
</template>
