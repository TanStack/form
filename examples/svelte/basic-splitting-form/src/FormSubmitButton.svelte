<script lang="ts">
  import type { AnySvelteFormApi } from '@tanstack/svelte-form'

  const { form }: { form: AnySvelteFormApi } = $props()
</script>

<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting] as const}
>
  {#snippet children([canSubmit, isSubmitting])}
    <button type="submit" disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? '...' : 'Submit'}
    </button>
  {/snippet}
</form.Subscribe>
