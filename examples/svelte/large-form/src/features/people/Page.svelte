<script lang="ts">
  import { useAppForm } from '../../hooks/form.js'
  import AddressFields from './AddressFields.svelte'
  import { FieldGroupEmergencyContact } from './emergency-contact.js'
  import { peopleFormOpts } from './shared-form.js'

  const form = useAppForm(() => ({
    ...peopleFormOpts,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  }))
</script>

<form
  onsubmit={(event) => {
    event.preventDefault()
    form.handleSubmit()
  }}
>
  <h1>Personal Information</h1>
  <form.Field name="fullName">
    {#snippet children(field)}<field.TextField label="Full Name" />{/snippet}
  </form.Field>
  <form.Field name="email">
    {#snippet children(field)}<field.TextField label="Email" />{/snippet}
  </form.Field>
  <form.Field name="phone">
    {#snippet children(field)}<field.TextField label="Phone" />{/snippet}
  </form.Field>
  <AddressFields {form} />
  <h2>Emergency Contact</h2>
  <FieldGroupEmergencyContact
    {form}
    fields={{
      fullName: 'emergencyContact.fullName',
      phone: 'emergencyContact.phone',
    }}
  />
  <form.AppForm>
    <form.SubscribeButton label="Submit" />
  </form.AppForm>
</form>
