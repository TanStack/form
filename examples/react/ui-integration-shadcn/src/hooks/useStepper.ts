import { useCallback, useState } from 'react'

export function useStepper(from: number, to: number) {
  const [step, setStep] = useState(from)
  const toNextStep = useCallback(
    () => setStep((prev) => Math.min(to, prev + 1)),
    [],
  )
  const toPreviousStep = useCallback(
    () => setStep((prev) => Math.max(from, prev - 1)),
    [],
  )
  const isFirstStep = step === from
  const isLastStep = step === to

  return { step, setStep, toNextStep, toPreviousStep, isLastStep, isFirstStep }
}
