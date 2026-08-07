<script lang="ts">
  import { getFormType } from '../../runes/form.js'
  import { step2Schema, wizardFormOpts } from './shared-form.js'

  const formType = getFormType({ ...wizardFormOpts })

  const {
    form,
    step,
    setStep,
  }: {
    form: typeof formType
    step: number
    setStep: (step: number) => void
  } = $props()
</script>

<form.FormGroup
  name="step2"
  validators={{
    onDynamic: step2Schema,
  }}
  onGroupSubmit={({ value: _value }) => {
    form.handleSubmit()
  }}
>
  {#snippet children(formGroup)}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        formGroup.handleSubmit()
      }}
    >
      <form.AppField name="step2.name">
        {#snippet children(field)}
          <field.TextField label="Step 2 Name" />
        {/snippet}
      </form.AppField>

      <button type="button" onclick={() => setStep(step - 1)}>Back</button>
      <form.AppForm>
        {#snippet children()}
          <form.SubscribeButton label="Submit" />
        {/snippet}
      </form.AppForm>
    </form>
  {/snippet}
</form.FormGroup>
