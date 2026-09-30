import { revalidateLogic } from '@tanstack/octane-form'
import { z } from 'zod'
import { useState } from 'octane'
import { useAppForm } from '../../hooks/form.tsrx'
import { step1Schema, step2Schema, wizardFormOpts } from './shared-form'
import { Step2Form } from './step2-subform.tsrx'
import { Step1Form } from './step1-subform.tsrx'

export function WizardPage() @{
  const [step, setStep] = useState(0)
  const form = useAppForm({
    ...wizardFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      // The whole-form schema runs when form.handleSubmit() is called.
      // A FormGroup validates only its current step's schema.
      onDynamic: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
    },
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  })

  <>
    @if (step === 0) {
      <Step1Form form={form} step={step} setStep={setStep} />
    } @else if (step === 1) {
      <Step2Form form={form} step={step} setStep={setStep} />
    }
  </>
}
