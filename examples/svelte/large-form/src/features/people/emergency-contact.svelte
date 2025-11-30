<script lang="ts">
  import type { createAppForm } from '../../runes/form.js'
  import { peopleFormOpts } from './shared-form.js'

  type AppForm = ReturnType<typeof createAppForm<typeof peopleFormOpts.defaultValues>>

  const { form }: { form: AppForm } = $props()
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
