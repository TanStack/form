<script lang="ts">
  import type { SvelteFormType } from '@tanstack/svelte-form'
  import { step2Schema, stepValidator } from './shared-form.js'
  import type { wizardFormOpts } from './shared-form.js'

  interface Props {
    form: SvelteFormType<typeof wizardFormOpts>
    step: number
    setStep: (step: number) => void
  }

  const { form, step, setStep }: Props = $props()
</script>

<form.FormGroup
  name="step2"
  validators={[stepValidator(step2Schema)]}
  onSubmit={async () => {
    await form.handleSubmit()
  }}
>
  {#snippet children(formGroup)}
    <form
      onsubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        formGroup.handleSubmit()
      }}
    >
      <formGroup.Field name="name">
        {#snippet children(field)}
          <field.TextField label="Step 2 Name" />
        {/snippet}
      </formGroup.Field>
      <button type="button" onclick={() => setStep(step - 1)}>Back</button>
      <form.SubscribeButton label="Submit" />
    </form>
  {/snippet}
</form.FormGroup>
