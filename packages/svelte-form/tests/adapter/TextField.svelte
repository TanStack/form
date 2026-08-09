<script lang="ts">
  import type { FieldWithValue } from '../../src/index.js'

  interface Props {
    field: FieldWithValue<string>
    label: string
  }

  const { field, label }: Props = $props()
</script>

<span data-testid="app-field">{label}:{field.name}:{field.value}</span>
