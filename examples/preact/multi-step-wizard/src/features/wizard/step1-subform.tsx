import { step1Schema, stepValidator } from './shared-form'
import type { wizardFormOpts } from './shared-form'
import type { PreactFormType } from '@tanstack/preact-form'

type WizardForm = PreactFormType<typeof wizardFormOpts>

interface Step1FormProps {
  form: WizardForm
  step: number
  setStep: (step: number) => void
}

export function Step1Form({ form, step, setStep }: Step1FormProps) {
  return (
    <form.FormGroup
      name="step1"
      validators={[stepValidator(step1Schema)]}
      onSubmit={() => {
        setStep(step + 1)
      }}
      onSubmitInvalid={() => {
        // Just like a form, you can also handle invalid submits at the group level, which is useful for multi-step wizards to prevent going to the next step if the current step is invalid
      }}
    >
      {(formGroup) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            formGroup.handleSubmit()
          }}
        >
          <formGroup.Field name="name">
            {(field) => <field.TextField label="Step 1 Name" />}
          </formGroup.Field>

          <form.SubscribeButton label="Submit" />
        </form>
      )}
    </form.FormGroup>
  )
}
