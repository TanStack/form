<script lang="ts">
  import { useSelector } from '../../src/index.js'
  import { untrack } from 'svelte'
  import type { nameFields } from './field-definition.js'

  export interface Props {
    fields: typeof nameFields
  }

  const { fields }: Props = $props()
  const values = useSelector(untrack(() => fields.atom))
</script>

<fields.Field name="name">
  {#snippet children(field)}
    <span data-testid="logical-field">{field.name}:{field.value}</span>
  {/snippet}
</fields.Field>
<span data-testid="logical-value">{values.current.name}</span>
<span data-testid="logical-items">{values.current.items.join(',')}</span>
<button type="button" onclick={() => fields.setFieldValue('name', 'Updated')}>
  Update logical
</button>
<button type="button" onclick={() => fields.moveFieldValue('items', 0, 2)}>
  Move logical item
</button>
