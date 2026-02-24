<script lang="ts">
  import { createAppForm } from '../../runes/form.js'
  import AddressFields from './address-fields.svelte'
  import EmergencyContact from './emergency-contact.svelte'
  import { peopleFormOpts } from './shared-form.js'

  const form = createAppForm(() => ({
    ...peopleFormOpts,
    validators: {
      onChange: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (!value.fullName) {
          errors.fields.fullName = 'Full name is required'
        }
        if (!value.phone) {
          errors.fields.phone = 'Phone is required'
        }
        if (!value.emergencyContact.fullName) {
          errors.fields['emergencyContact.fullName'] =
            'Emergency contact full name is required'
        }
        if (!value.emergencyContact.phone) {
          errors.fields['emergencyContact.phone'] =
            'Emergency contact phone is required'
        }

        return errors
      },
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  }))
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    form.handleSubmit()
  }}
>
  <h1>Personal Information</h1>
  <form.AppField name="fullName">
    {#snippet children(field)}
      <field.TextField label="Full Name" />
    {/snippet}
  </form.AppField>
  <form.AppField name="email">
    {#snippet children(field)}
      <field.TextField label="Email" />
    {/snippet}
  </form.AppField>
  <form.AppField name="phone">
    {#snippet children(field)}
      <field.TextField label="Phone" />
    {/snippet}
  </form.AppField>
  <AddressFields {form} />
  <h2>Emergency Contact</h2>
  <EmergencyContact {form} />
  <form.AppForm>
    {#snippet children()}
      <form.SubscribeButton label="Submit" />
    {/snippet}
  </form.AppForm>
</form>
