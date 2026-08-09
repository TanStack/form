<script lang="ts">
  import type { SvelteFormType } from '@tanstack/svelte-form'
  import type { peopleFormOpts } from './shared-form.js'

  const { form }: { form: SvelteFormType<typeof peopleFormOpts> } = $props()
</script>

<section>
  <h2>Address</h2>
  <form.Field name="address.line1">
    {#snippet children(field)}<field.TextField label="Address Line 1" />{/snippet}
  </form.Field>
  <form.Field name="address.line2">
    {#snippet children(field)}<field.TextField label="Address Line 2" />{/snippet}
  </form.Field>
  <form.Field name="address.city">
    {#snippet children(field)}<field.TextField label="City" />{/snippet}
  </form.Field>
  <form.Field name="address.state">
    {#snippet children(field)}<field.TextField label="State" />{/snippet}
  </form.Field>
  <form.Field name="address.zip">
    {#snippet children(field)}<field.TextField label="ZIP Code" />{/snippet}
  </form.Field>
</section>
