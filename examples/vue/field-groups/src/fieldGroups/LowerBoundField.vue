<script setup lang="ts">
import { z } from 'zod'
import StringField from '../StringField.vue'
import type { lowerBound } from './definitions'

defineProps<{ fields: typeof lowerBound.fields; label: string }>()

const boundsSchema = z.coerce.number<string>().int()
</script>

<template>
  <fields.Field
    name="value"
    :validators="[{ run: boundsSchema, triggers: ['change'] }]"
    :listeners="[
      {
        triggers: ['blur'],
        run: ({ value }) => {
          fields.setFieldValue('value', parseInt(value, 10).toString())
        },
      },
    ]"
    v-slot="{ field }"
  >
    <StringField :field="field" :label="label" />
  </fields.Field>
</template>
