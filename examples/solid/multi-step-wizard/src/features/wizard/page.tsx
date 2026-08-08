import { Show, createSignal } from 'solid-js'
import { useAppForm } from '../../hooks/form'
import { wizardFormOpts } from './shared-form'
import { Step1Form } from './step1-subform'
import { Step2Form } from './step2-subform'

export function WizardPage() {
  const [step, setStep] = createSignal(0)
  const form = useAppForm(() => ({
    ...wizardFormOpts,
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  }))

  return (
    <form.AppForm>
      <Show when={step() === 0}>
        <Step1Form form={form} step={step()} setStep={setStep} />
      </Show>
      <Show when={step() === 1}>
        <Step2Form form={form} step={step()} setStep={setStep} />
      </Show>
    </form.AppForm>
  )
}
