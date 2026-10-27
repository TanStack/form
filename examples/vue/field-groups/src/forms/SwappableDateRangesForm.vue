<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { DateRangeField } from '../fieldGroups/dateRange'

const form = useForm({
  defaultValues: {
    dateRanges: [
      { id: 'A', start: '2026-07-01', end: '2026-07-05' },
      { id: 'B', start: '2026-08-10', end: '2026-08-15' },
    ],
  },
})
</script>

<template>
  <button type="button" @click="form.swapFieldValues('dateRanges', 0, 1)">
    Swap date ranges
  </button>
  <form.ArrayField name="dateRanges" v-slot="{ field: array }">
    <DateRangeField
      v-for="(range, index) in array.value"
      :key="range.id"
      :label="`Range ${range.id}`"
      :form="form"
      :fields="{
        start: `dateRanges[${index}].start`,
        end: `dateRanges[${index}].end`,
      }"
    />
  </form.ArrayField>
</template>
