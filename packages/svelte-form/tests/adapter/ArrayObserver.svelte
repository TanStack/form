<script lang="ts">
  import { untrack } from 'svelte'
  import type { FieldWithValue } from '../../src/index.js'

  interface Props {
    field: FieldWithValue<Array<{ name: string }>>
  }

  const { field }: Props = $props()
  let runs = $state(0)

  $effect(() => {
    field.value
    untrack(() => runs++)
  })
</script>

<span data-testid="array-runs">{runs}</span>
<span data-testid="array-length">{field.value.length}</span>
