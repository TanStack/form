import { revalidateLogic } from '@tanstack/react-form'
import { useAppForm } from '../../hooks/form.tsx'
import { wizardFormOpts } from './shared-form.tsx'
import { z } from 'zod'
import { Step2Form } from './step2-subform.tsx'
import { useState } from 'react'
import { Step1Form } from './step1-subform.tsx'

export const WizardPage = () => {
  const [step, setStep] = useState(0)
  const form = useAppForm({
    ...wizardFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        step1: z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
        }),
        // Will run when `step2` group is submitted or the whole form is submitted.
        // When `step2` group is submitted, it will run the form's validators, then throw aways errors on `step1`
        step2: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters'),
        }),
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
