import { revalidateLogic } from '@tanstack/preact-form'
import { z } from 'zod'
import { useState } from 'preact/hooks'
import { useAppForm } from '../../hooks/form'
import { step1Schema, step2Schema, wizardFormOpts } from './shared-form'
import { Step2Form } from './step2-subform'
import { Step1Form } from './step1-subform'

export const WizardPage = () => {
  const [step, setStep] = useState(0)
  const form = useAppForm({
    ...wizardFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      // onDynamic is only used when `form.handleSubmit` is called itself.
      // When `form.FormGroup`'s `handleSubmit` is called, it will only validate the current step's schema.
      // This means that this schema will not be called when the user submits the form group, but instead when they submit the entire form.
      onDynamic: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
    },
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  })

  return (
    <>
      {step === 0 && <Step1Form form={form} step={step} setStep={setStep} />}
      {step === 1 && <Step2Form form={form} step={step} setStep={setStep} />}
    </>
  )
}
