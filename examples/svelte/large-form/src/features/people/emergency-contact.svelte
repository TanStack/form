<script lang="ts">
  import { getFormType } from '../../runes/form.js'
  import { peopleFormOpts } from './shared-form.js'

  const formType = getFormType({ ...peopleFormOpts })

  const { form }: { form: typeof formType } = $props()
</script>

<form.AppField name="emergencyContact.fullName">
  {#snippet children(field)}
    <field.TextField label="Full Name" />
  {/snippet}
</form.AppField>
<form.AppField name="emergencyContact.phone">
  {#snippet children(field)}
    <field.TextField label="Phone" />
  {/snippet}
</form.AppField>
