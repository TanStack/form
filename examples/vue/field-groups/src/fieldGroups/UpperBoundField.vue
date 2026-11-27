<script setup lang="ts">
import { z } from 'zod'
import StringField from '../StringField.vue'
import type { upperBound } from './definitions'

const props = defineProps<{ fields: typeof upperBound.fields; label: string }>()

const boundsSchema = z.coerce.number<string>().int()
</script>

<template>
  <fields.Field
    name="value"
    :validators="[
      {
        triggers: ['change'],
        // Watched names are resolved through every parent group.
        watchFields: ['lowerBound'],
        run: ({ value }) => {
          const upper = boundsSchema.safeParse(value)
          if (!upper.success) return upper.error.issues

          const lower = boundsSchema.safeParse(
            props.fields.getFieldValue('lowerBound'),
          )
          if (!lower.success) return
          if (upper.data < lower.data) {
            return 'Upper bound must be greater than lower bound'
          }
        },
      },
    ]"
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
