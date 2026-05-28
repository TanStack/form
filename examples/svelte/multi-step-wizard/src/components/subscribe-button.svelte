<script lang="ts">
  import { useFormContext } from '../runes/form-context.js'

  const form = useFormContext()

  const { label }: { label: string } = $props()
</script>

<form.Subscribe selector={(state) => state.isSubmitting}>
  {#snippet children(isSubmitting)}
    <button type="submit" disabled={isSubmitting}>{label}</button>
  {/snippet}
</form.Subscribe>
