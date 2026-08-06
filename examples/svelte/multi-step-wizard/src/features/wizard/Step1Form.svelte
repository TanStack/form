<script lang="ts">
  import type { SvelteFormType } from '@tanstack/svelte-form'
  import { step1Schema, stepValidator } from './shared-form.js'
  import type { wizardFormOpts } from './shared-form.js'

  interface Props {
    form: SvelteFormType<typeof wizardFormOpts>
    step: number
    setStep: (step: number) => void
  }

  const { form, step, setStep }: Props = $props()
</script>

<form.FormGroup
  name="step1"
  validators={[stepValidator(step1Schema)]}
  onSubmit={() => setStep(step + 1)}
  onSubmitInvalid={() => {
    // Keep the user on this step when its scoped validation fails.
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
          <field.TextField label="Step 1 Name" />
        {/snippet}
      </formGroup.Field>
      <form.SubscribeButton label="Next" />
    </form>
  {/snippet}
</form.FormGroup>
