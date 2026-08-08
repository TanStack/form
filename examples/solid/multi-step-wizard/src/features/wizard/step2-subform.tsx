import { step2Schema, stepValidator } from './shared-form'
import type { SolidFormType } from '@tanstack/solid-form'
import type { wizardFormOpts } from './shared-form'

type WizardForm = SolidFormType<typeof wizardFormOpts>

interface Step2FormProps {
  form: WizardForm
  step: number
  setStep: (step: number) => void
}

export function Step2Form(props: Step2FormProps) {
  return (
    <props.form.FormGroup
      name="step2"
      validators={[stepValidator(step2Schema)]}
      onSubmit={() => {
        props.form.handleSubmit()
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
            {(field) => <field.TextField label="Step 2 Name" />}
          </formGroup.Field>
          <button type="button" onClick={() => props.setStep(props.step - 1)}>
            Back
          </button>
          <props.form.SubscribeButton label="Submit" />
        </form>
      )}
    </props.form.FormGroup>
  )
}
