<script lang="ts">
  import StringField from '../StringField.svelte'
  import { boundsSchema } from './fieldBounds.js'
  import type { upperBoundFields } from './fieldBounds.js'

  export interface Props {
    fields: typeof upperBoundFields
    label: string
  }

  const { fields, label }: Props = $props()
</script>

<fields.Field
  name="value"
  validators={[
    {
      triggers: ['change'],
      watchFields: ['lowerBound'],
      run: ({ value, parseIssues }) => {
        const upperBoundResult = boundsSchema.safeParse(value)
        if (!upperBoundResult.success) {
          return parseIssues(upperBoundResult.error.issues)
        }
        const lowerBoundResult = boundsSchema.safeParse(
          fields.getFieldValue('lowerBound'),
        )
        if (!lowerBoundResult.success) return
        if (upperBoundResult.data < lowerBoundResult.data) {
          return 'Upper bound must be greater than lower bound'
        }
      },
    },
  ]}
  listeners={[
    {
      run: ({ value }) => {
        fields.setFieldValue('value', parseInt(value, 10).toString())
      },
      triggers: ['blur'],
    },
  ]}
>
  {#snippet children(field)}
    <StringField {field} {label} />
  {/snippet}
</fields.Field>
