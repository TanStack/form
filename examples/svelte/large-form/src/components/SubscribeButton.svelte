<script lang="ts">
  import { useFormContext } from '../hooks/form.js'

  const { label }: { label: string } = $props()
  const form = useFormContext()
</script>

<form.Subscribe selector={(state) => state.isSubmitting}>
  {#snippet children(isSubmitting)}
    <button type="submit" disabled={isSubmitting}>{label}</button>
  {/snippet}
</form.Subscribe>
