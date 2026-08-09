<script lang="ts">
  import { appContext } from './app-context.js'

  const form = appContext.useFormContext!()
</script>

<form.Subscribe selector={(state) => state.values}>
  {#snippet children(values)}
    <span data-testid="summary">{JSON.stringify(values)}</span>
  {/snippet}
</form.Subscribe>
