import { useState } from 'preact/hooks'
import { useAppForm } from '../../hooks/form.tsx'
import { wizardFormOpts } from './shared-form.tsx'
import { Step2Form } from './step2-subform.tsx'
import { Step1Form } from './step1-subform.tsx'

export const WizardPage = () => {
  const [step, setStep] = useState(0)
  const form = useAppForm({
    ...wizardFormOpts,
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  })

  return (
    <form.AppForm>
      {step === 0 && <Step1Form form={form} step={step} setStep={setStep} />}
      {step === 1 && <Step2Form form={form} step={step} setStep={setStep} />}
    </form.AppForm>
  )
}
