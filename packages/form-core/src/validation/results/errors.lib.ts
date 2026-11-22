import { normalizeToArray } from '../../utils.lib'
import { isSuccessfulValidationResult } from './validationOutput.lib'
import type {
  FieldValidateResult,
  FormGroupValidateResult,
  FormValidationResult,
  FormattedValidationError,
  FormattedValidationResult,
  SuccessfulValidationResult,
  ValidationErrorInput,
  ValidationErrorMap,
  ValidationFailure,
  ValidationIssue,
  ValidationSuccess,
} from './results.public'

type ValidateResult =
  FormValidationResult<any> | FormGroupValidateResult<any> | FieldValidateResult

export function normalizeValidationError(
  value: ValidationErrorInput | ValidationFailure | null | undefined | void,
): Array<ValidationIssue> {
  return normalizeToArray(value).map((error) =>
    typeof error === 'string' ? { message: error } : error,
  )
}

export interface ParsedValidationResult {
  self: Array<ValidationIssue> | null
  subfields: Record<string, Array<ValidationIssue>> | null
}

/**
 * Checks whether a validation result is a routable form-style error map.
 *
 * Issue objects are excluded even though they are also object values.
 */
export function isValidationErrorMap(
  value: unknown,
): value is ValidationErrorMap<any, any, any> {
  if (typeof value !== 'object') return false
  if (value === null) return false
  if (Array.isArray(value)) return false
  if ('message' in value) return false
  if (!('fields' in value)) return false

  const fields = value.fields
  if (typeof fields !== 'object') return false
  if (fields === null) return false
  if (Array.isArray(fields)) return false
  return true
}

export function formatValidationResult<TFormData>(
  value: FormValidationResult<TFormData>,
): FormattedValidationResult<TFormData> {
  if (isSuccessfulValidationResult(value)) {
    return value
  }

  if (isValidationErrorMap(value)) {
    const normalizedSelf = normalizeValidationError(value.form)
    const subfields: Record<string, Array<ValidationIssue>> = {}

    for (const [fieldName, fieldError] of Object.entries<
      ValidationFailure | undefined
    >(value.fields)) {
      const normalizedFieldError = normalizeValidationError(fieldError)

      if (normalizedFieldError.length > 0) {
        // If some moron decided to use ['__proto__'] as path,
        // normal assignment would break. I don't think this is a hot path,
        // so I didn't check normal assignment vs. this as benchmark.
        Object.defineProperty(subfields, fieldName, {
          value: normalizedFieldError,
          enumerable: true,
          writable: true,
          configurable: true,
        })
      }
    }

    return { form: normalizedSelf, fields: subfields }
  }

  return normalizeValidationError(value)
}

export function getValidationErrors<TFormData>(
  value: FormValidationResult<TFormData>,
): Array<FormattedValidationError<TFormData>> {
  const formatted = formatValidationResult(value)
  if (isSuccessfulValidationResult(formatted)) return []
  if (Array.isArray(formatted)) return formatted

  if (
    formatted.form.length === 0 &&
    Object.keys(formatted.fields).length === 0
  ) {
    return []
  }
  return [formatted]
}

/** Splits formatted errors into errors for the owner and its subfields. */
export function parseValidationResult(
  value: ValidateResult,
): ParsedValidationResult {
  const formatted = formatValidationResult(value)
  if (isSuccessfulValidationResult(formatted)) {
    return { self: null, subfields: null }
  }

  const self = Array.isArray(formatted) ? formatted : formatted.form

  return {
    self: self.length > 0 ? self : null,
    subfields: Array.isArray(formatted)
      ? null
      : (formatted.fields as Record<string, Array<ValidationIssue>>),
  }
}

/**
 * Checks whether a validation result contains an error that would be stored.
 */
export function isErrorResult<T extends ValidateResult>(
  value: T,
  // TODO merge these two after migration
): value is Exclude<T, SuccessfulValidationResult | ValidationSuccess> {
  return getValidationErrors(value).length > 0
}
