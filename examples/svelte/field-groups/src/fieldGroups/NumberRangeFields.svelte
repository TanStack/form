<script lang="ts">
  import { LowerBoundField, UpperBoundField } from './fieldBounds.js'
  import type { numberRangeFields } from './numberRange.js'

  export interface Props {
    fields: typeof numberRangeFields
    label: string
  }

  const { fields, label }: Props = $props()
</script>

<fieldset>
  <legend>{label}</legend>
  <!-- Pass the parent group's fields as form; child bindings use its virtual names. -->
  <LowerBoundField
    label="Minimum"
    form={fields}
    fields={{ value: 'minimum' }}
  />
  <UpperBoundField
    label="Maximum"
    form={fields}
    fields={{ value: 'maximum', lowerBound: 'minimum' }}
  />
</fieldset>
