import { step1Schema, stepValidator } from './shared-form'
import type { SolidFormType } from '@tanstack/solid-form'
import type { wizardFormOpts } from './shared-form'

type WizardForm = SolidFormType<typeof wizardFormOpts>

interface Step1FormProps {
  form: WizardForm
  step: number
  setStep: (step: number) => void
}

export function Step1Form(props: Step1FormProps) {
  return (
    <props.form.FormGroup
      name="step1"
      validators={[stepValidator(step1Schema)]}
      onSubmit={() => {
        props.setStep(props.step + 1)
      }}
      onSubmitInvalid={() => {
        // Keep the user on this step until its group is valid.
      }}
    >
      {(formGroup) => (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            formGroup().handleSubmit()
          }}
        >
          <formGroup.Field name="name">
            {(field) => <field.TextField label="Step 1 Name" />}
          </formGroup.Field>
          <props.form.SubscribeButton label="Next" />
        </form>
      )}
    </props.form.FormGroup>
  )
}
