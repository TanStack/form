import { step2Schema, stepValidator } from './shared-form'
import type { wizardFormOpts } from './shared-form'
import type { PreactFormType } from '@tanstack/preact-form'

type WizardForm = PreactFormType<typeof wizardFormOpts>

interface Step2FormProps {
  form: WizardForm
  step: number
  setStep: (step: number) => void
}

export function Step2Form({ form, step, setStep }: Step2FormProps) {
  return (
    <form.FormGroup
      name="step2"
      validators={[stepValidator(step2Schema)]}
      onSubmit={() => {
        form.handleSubmit().catch(console.error)
      }}
    >
      {(formGroup) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            formGroup.handleSubmit().catch(console.error)
          }}
        >
          <formGroup.Field name="name">
            {(field) => <field.TextField label="Step 2 Name" />}
          </formGroup.Field>

          <button type="button" onClick={() => setStep(step - 1)}>
            Back
          </button>
          <form.SubscribeButton label="Submit" />
        </form>
      )}
    </form.FormGroup>
  )
}
