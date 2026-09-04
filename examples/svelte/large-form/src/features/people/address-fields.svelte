<script lang="ts">
  import { getFormType } from '../../runes/form.js'
  import { peopleFormOpts } from './shared-form.js'

  const formType = getFormType({ ...peopleFormOpts })

  const { form }: { form: typeof formType } = $props()
</script>

<div>
  <h2>Address</h2>
  <form.AppField name="address.line1">
    {#snippet children(field)}
      <field.TextField label="Address Line 1" />
    {/snippet}
  </form.AppField>
  <form.AppField name="address.line2">
    {#snippet children(field)}
      <field.TextField label="Address Line 2" />
    {/snippet}
  </form.AppField>
  <form.AppField name="address.city">
    {#snippet children(field)}
      <field.TextField label="City" />
    {/snippet}
  </form.AppField>
  <form.AppField name="address.state">
    {#snippet children(field)}
      <field.TextField label="State" />
    {/snippet}
  </form.AppField>
  <form.AppField name="address.zip">
    {#snippet children(field)}
      <field.TextField label="ZIP Code" />
    {/snippet}
  </form.AppField>
</div>
