import type { OnSubmitError } from './FormApi/formSubmit.public'
import type { FormValidationFailure } from './validation/results/results.public'

export const submitErrorSymbol = Symbol('Submit error')

export function isSubmitError<TFormData>(
  value: unknown,
): value is OnSubmitError<FormValidationFailure<TFormData>> {
  return (
    typeof value === 'object' && value !== null && submitErrorSymbol in value
  )
}

export function createValidationError<
  TError extends FormValidationFailure<any>,
>(error: TError): OnSubmitError<TError> {
  return { [submitErrorSymbol]: error }
}

export function withSubmitError<TFunction extends (...args: any) => unknown>(
  callback: TFunction,
): any {
  return (...args: any[]) => {
    const obj = callback(...args)
    Object.defineProperty(obj, submitErrorSymbol, { value: obj })
    return obj
  }
}
