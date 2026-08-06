<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import FormSection from './FormSection.svelte'
  import FormSubmitButton from './FormSubmitButton.svelte'
  import StringField from './StringField.svelte'
  import { sharedFormOptions } from './sharedForm.js'
  import './index.css'

  const form = createForm(() => ({
    ...sharedFormOptions,
    onSubmit: ({ value }) => {
      console.log(value)
    },
  }))
</script>

<div>
  <h1>Split Form Example</h1>
  <form
    onsubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      form.handleSubmit()
    }}
  >
    <form.Field name="firstName">
      {#snippet children(field)}
        <StringField {field} label="First Name" />
      {/snippet}
    </form.Field>
    <form.Field name="lastName">
      {#snippet children(field)}
        <StringField {field} label="Last Name" />
      {/snippet}
    </form.Field>
    <FormSection {form} />
    <FormSubmitButton {form} />
    <button
      type="reset"
      onclick={(event) => {
        event.preventDefault()
        form.reset()
      }}
    >
      Reset
    </button>
  </form>
</div>
