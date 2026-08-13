import { evaluate, isNil, normalizeToArray } from '../utils.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type {
  FieldValidateResult,
  FormGroupValidateResult,
  FormValidateResult,
  ValidationErrorInput,
  ValidationErrorMap,
  ValidationIssue,
} from '../validation.public'

type ValidateResult =
  FormValidateResult<any> | FormGroupValidateResult<any> | FieldValidateResult

export function normalizeValidationError(
  value: ValidationErrorInput | null | undefined,
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
 * @private
 * Check whether a validation result is an error map.
 */
export function isValidationErrorMap(
  value: unknown,
): value is ValidationErrorMap<any> {
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

/**
 * @private
 * Normalize a validation result into errors owned by the validation boundary
 * and errors routed to its subfields.
 */
export function parseValidationResult(
  value: ValidateResult,
): ParsedValidationResult {
  if (isNil(value) || value === false) {
    return { self: null, subfields: null }
  }

  if (isValidationErrorMap(value)) {
    const normalizedSelf = normalizeValidationError(value.form)
    const subfields: Record<string, Array<ValidationIssue>> = {}

    for (const [fieldName, fieldError] of Object.entries(value.fields)) {
      const normalizedFieldError = normalizeValidationError(fieldError)

      if (normalizedFieldError.length > 0) {
        subfields[fieldName] = normalizedFieldError
      }
    }

    return {
      self: normalizedSelf.length > 0 ? normalizedSelf : null,
      subfields,
    }
  }

  const normalizedSelf = normalizeValidationError(value)

  return {
    self: normalizedSelf.length > 0 ? normalizedSelf : null,
    subfields: null,
  }
}

/**
 * @private
 * Check if a validation result contains an error that would be stored.
 */
export function isErrorResult<T extends ValidateResult>(
  value: T,
): value is Exclude<T, null | undefined | false> {
  const { self, subfields } = parseValidationResult(value)

  return (
    self !== null || (subfields !== null && Object.keys(subfields).length > 0)
  )
}

export function hasIndexedErrorFromSource(
  errors: Array<Array<ValidationIssue>>,
  errorSourceEvents: Array<string | null>,
  index: number,
  sourceEvent: string,
): boolean {
  const error = errors[index]
  if (!error) return false
  if (error.length === 0) return false
  if (errorSourceEvents[index] !== sourceEvent) return false
  return true
}

export function hasIndexedErrors(
  errors: Array<Array<ValidationIssue>>,
): boolean {
  return errors.some((validatorErrors) => validatorErrors.length > 0)
}

export function setIndexedError(
  errors: Array<Array<ValidationIssue>>,
  errorSourceEvents: Array<string | null>,
  index: number,
  error: Array<ValidationIssue>,
  sourceEvent: string,
): {
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
} | null {
  const nextSourceEvent = error.length > 0 ? sourceEvent : null
  const prevError = errors[index] ?? []

  if (
    evaluate(prevError, error) &&
    errorSourceEvents[index] === nextSourceEvent
  ) {
    return null
  }

  const nextLength = Math.max(
    errors.length,
    errorSourceEvents.length,
    index + 1,
  )
  const nextErrors = Array.from(
    { length: nextLength },
    (_, errorIndex) => errors[errorIndex] ?? [],
  )
  const nextErrorSourceEvents = Array.from(
    { length: nextLength },
    (_, errorIndex) => errorSourceEvents[errorIndex] ?? null,
  )
  nextErrors[index] = error
  nextErrorSourceEvents[index] = nextSourceEvent

  return {
    errors: nextErrors,
    errorSourceEvents: nextErrorSourceEvents,
  }
}

export function clearIndexedErrorsFromSource(
  errors: Array<Array<ValidationIssue>>,
  errorSourceEvents: Array<string | null>,
  indexes: Array<number>,
  sourceEvent: string,
): {
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
} | null {
  let nextErrors: Array<Array<ValidationIssue>> | null = null
  let nextErrorSourceEvents: Array<string | null> | null = null

  for (const index of indexes) {
    if (
      hasIndexedErrorFromSource(errors, errorSourceEvents, index, sourceEvent)
    ) {
      nextErrors ??= errors.slice()
      nextErrorSourceEvents ??= errorSourceEvents.slice()
      nextErrors[index] = []
      nextErrorSourceEvents[index] = null
    }
  }

  if (!nextErrors || !nextErrorSourceEvents) return null

  return {
    errors: nextErrors,
    errorSourceEvents: nextErrorSourceEvents,
  }
}

export function reconcileRoutedFieldErrors(
  validatorIndex: number,
  fieldErrors: Iterable<readonly [AnyInternalFieldApi, Array<ValidationIssue>]>,
  oldFieldRefs: Set<AnyInternalFieldApi> | undefined,
  setFieldError: (
    field: AnyInternalFieldApi,
    validatorIndex: number,
    errors: Array<ValidationIssue>,
  ) => void,
  clearFieldError: (field: AnyInternalFieldApi, validatorIndex: number) => void,
): {
  fieldRefs: Set<AnyInternalFieldApi>
  affectedFields: Set<AnyInternalFieldApi>
  didFieldRefsChange: boolean
} {
  const staleFieldRefs = oldFieldRefs ? new Set(oldFieldRefs) : undefined
  const affectedFields = new Set<AnyInternalFieldApi>()
  const newFieldRefs = new Set<AnyInternalFieldApi>()

  for (const [field, fieldError] of fieldErrors) {
    setFieldError(field, validatorIndex, fieldError)
    newFieldRefs.add(field)
    affectedFields.add(field)
    staleFieldRefs?.delete(field)
  }

  if (staleFieldRefs) {
    for (const field of staleFieldRefs) {
      clearFieldError(field, validatorIndex)
      affectedFields.add(field)
    }
  }

  return {
    fieldRefs: newFieldRefs,
    affectedFields,
    didFieldRefsChange:
      newFieldRefs.size > 0 ||
      (oldFieldRefs !== undefined && oldFieldRefs.size > 0),
  }
}
