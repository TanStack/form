<script setup lang="ts">
import { useSelector } from '@tanstack/vue-form'
import StringField from '../StringField.vue'
import type { dateRange } from './definitions'

const props = defineProps<{ fields: typeof dateRange.fields; label: string }>()
// This atom exposes only the values declared by the date-range group.
const dates = useSelector(props.fields.atom)
</script>

<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <p>Selected range: {{ dates.start }} – {{ dates.end }}</p>
    <fields.Field name="start" v-slot="{ field }">
      <StringField :field="field" label="Start date" type="date" />
    </fields.Field>
    <fields.Field
      name="end"
      :validators="[
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value }) =>
                Boolean(value && props.fields.getFieldValue('start')),
            },
          ],
          watchFields: ['start'],
          run: ({ value }) => {
            // Read current values during validation, before Vue renders subscriptions.
            if (value < props.fields.getFieldValue('start')) {
              return 'End date must be after the start date'
            }
          },
        },
      ]"
      v-slot="{ field }"
    >
      <StringField :field="field" label="End date" type="date" />
    </fields.Field>
  </fieldset>
</template>
