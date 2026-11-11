import type {
  ValidationOutput,
  ValidationSuccess,
} from './validation/state.public'

export const VALIDATION_OUTPUT = Symbol('VALIDATION_OUTPUT')

export function createOutput<TOutput>(
  value: TOutput,
): ValidationOutput<TOutput> {
  return { [VALIDATION_OUTPUT]: value }
}

export function isValidationOutput(
  value: unknown,
): value is ValidationOutput<unknown> {
  return (
    typeof value === 'object' && value !== null && VALIDATION_OUTPUT in value
  )
}

export function isSuccessfulValidationResult(
  value: unknown,
): value is ValidationSuccess {
  return (
    value === null ||
    value === undefined ||
    value === false ||
    isValidationOutput(value)
  )
}
