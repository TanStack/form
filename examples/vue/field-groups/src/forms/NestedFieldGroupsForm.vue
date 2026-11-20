<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { NumberRangeField } from '../fieldGroups/numberRange'

const form = useForm({
  defaultValues: { filters: { minBudget: '10', maxBudget: '100' } },
})
</script>

<template>
  <NumberRangeField
    label="Budget"
    :form="form"
    :fields="{ minimum: 'filters.minBudget', maximum: 'filters.maxBudget' }"
  />
  <form.Subscribe :selector="(state) => state.values.filters" v-slot="filters">
    <pre>{{ JSON.stringify(filters, null, 2) }}</pre>
  </form.Subscribe>
</template>
