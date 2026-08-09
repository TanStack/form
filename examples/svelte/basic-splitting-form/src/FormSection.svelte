<script lang="ts">
  import type { SvelteFormType } from '@tanstack/svelte-form'
  import StringField from './StringField.svelte'
  import type { sharedFormOptions } from './sharedForm.js'

  const { form }: { form: SvelteFormType<typeof sharedFormOptions> } = $props()
</script>

<form.Field name="address.street">
  {#snippet children(field)}
    <StringField {field} label="Street" />
  {/snippet}
</form.Field>
<form.Field name="address.country">
  {#snippet children(field)}
    <StringField {field} label="Country" />
  {/snippet}
</form.Field>
