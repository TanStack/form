<script lang="ts">
  import StringField from '../StringField.svelte'
  import { boundsSchema } from './fieldBounds.js'
  import type { lowerBoundFields } from './fieldBounds.js'

  export interface Props {
    fields: typeof lowerBoundFields
    label: string
  }

  const { fields, label }: Props = $props()
</script>

<fields.Field
  name="value"
  validators={[{ run: boundsSchema, triggers: ['change'] }]}
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
