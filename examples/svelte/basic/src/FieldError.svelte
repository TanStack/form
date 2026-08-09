<script lang="ts">
  import type { AnyFieldApi } from '@tanstack/svelte-form'

  const { field }: { field: AnyFieldApi } = $props()
</script>

<small
  role={field.meta.isInvalid ? 'alert' : undefined}
  aria-live="polite"
>
  {field.errors.map((error) => error.message).join('\n')}
</small>
