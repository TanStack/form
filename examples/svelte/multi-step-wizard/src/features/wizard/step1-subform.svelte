<script lang="ts">
  import { getFormType } from '../../runes/form.js'
  import { step1Schema, wizardFormOpts } from './shared-form.js'

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
  name="step1"
  validators={{
    onDynamic: step1Schema,
  }}
  onGroupSubmit={({ value: _value }) => {
    setStep(step + 1)
  }}
  onGroupSubmitInvalid={() => {
    // Just like a form, you can also handle invalid submits at the group level, which is useful for multi-step wizards to prevent going to the next step if the current step is invalid
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
      <form.AppField name="step1.name">
        {#snippet children(field)}
          <field.TextField label="Step 1 Name" />
        {/snippet}
      </form.AppField>

      <form.AppForm>
        {#snippet children()}
          <form.SubscribeButton label="Submit" />
        {/snippet}
      </form.AppForm>
      <!-- formGroup contains errorMaps and errors, just like forms and fields -->
      <pre>{JSON.stringify(formGroup.state.meta.errorMap, null, 2)}</pre>
    </form>
  {/snippet}
</form.FormGroup>
