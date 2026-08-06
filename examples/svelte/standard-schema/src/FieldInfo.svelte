<script lang="ts">
  import type { AnyFieldApi } from '@tanstack/svelte-form'

  const { field }: { field: AnyFieldApi } = $props()
</script>

{#if field.meta.isTouched && field.meta.isInvalid}
  <em role="alert">
    {field.errors.map((error) => error.message).join(', ')}
  </em>
{/if}
{#if field.meta.isValidating}Validating...{/if}
