import { evaluate, isNil, normalizeToArray } from '../utils.lib'
import { compareValidationSources } from '../ValidationSourceInstance.lib'
import type { AnyInternalValidationSourceInstance } from '../ValidationSourceInstance.lib'
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
 * Checks whether a validation result is a routable form-style error map.
 *
 * Issue objects are excluded even though they are also object values.
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
 * Normalizes a validation result into errors owned by the validation boundary
 * and errors routed to its subfields.
 *
 * Empty error collections collapse to `null` so callers can distinguish them
 * from errors that must be stored.
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
 * Checks whether a validation result contains an error that would be stored.
 */
export function isErrorResult<T extends ValidateResult>(
  value: T,
): value is Exclude<T, null | undefined | false> {
  const { self, subfields } = parseValidationResult(value)

  return (
    self !== null || (subfields !== null && Object.keys(subfields).length > 0)
  )
}

export interface ValidationSourceErrorState {
  errors: Array<ValidationIssue>
  sourceEvent: string
}

export type ValidationSourceErrorMap = Map<
  AnyInternalValidationSourceInstance,
  ValidationSourceErrorState
>

/** Checks whether a source's stored errors came from a specific event. */
export function hasValidationSourceErrorFromEvent(
  errorMap: ValidationSourceErrorMap | null,
  validationSource: AnyInternalValidationSourceInstance,
  sourceEvent: string,
): boolean {
  return errorMap?.get(validationSource)?.sourceEvent === sourceEvent
}

/**
 * Applies one validation source's errors with copy-on-write map semantics.
 *
 * Empty errors remove the source. Returns `null` when the stored value and
 * source event already match, allowing atom owners to preserve identity.
 */
export function setValidationSourceError(
  errorMap: ValidationSourceErrorMap | null,
  validationSource: AnyInternalValidationSourceInstance,
  errors: Array<ValidationIssue>,
  sourceEvent: string,
): { errorMap: ValidationSourceErrorMap | null } | null {
  const previous = errorMap?.get(validationSource)
  if (
    previous &&
    evaluate(previous.errors, errors) &&
    previous.sourceEvent === sourceEvent
  ) {
    return null
  }
  if (!previous && errors.length === 0) return null

  const next = errorMap ? new Map(errorMap) : new Map()
  if (errors.length > 0) {
    next.set(validationSource, { errors, sourceEvent })
  } else {
    next.delete(validationSource)
  }

  return { errorMap: next.size > 0 ? next : null }
}

/**
 * Removes errors from selected sources only when their source event matches.
 *
 * The map is cloned lazily and `null` is returned when no entry changes.
 */
export function clearValidationSourceErrorsFromEvent(
  errorMap: ValidationSourceErrorMap | null,
  validationSources: Iterable<AnyInternalValidationSourceInstance>,
  sourceEvent: string,
): { errorMap: ValidationSourceErrorMap | null } | null {
  if (!errorMap) return null

  let next: ValidationSourceErrorMap | null = null
  for (const validationSource of validationSources) {
    if (
      !hasValidationSourceErrorFromEvent(
        errorMap,
        validationSource,
        sourceEvent,
      )
    ) {
      continue
    }

    if (!next) {
      next = new Map(errorMap)
    }
    next.delete(validationSource)
  }

  if (!next) return null
  return { errorMap: next.size > 0 ? next : null }
}

/**
 * Flattens stored issues by scope priority and then pipeline position.
 */
export function getValidationSourceErrors(
  errorMap: ValidationSourceErrorMap | null,
  validationSources?: ReadonlyArray<AnyInternalValidationSourceInstance> | null,
): Array<ValidationIssue> {
  if (!errorMap) return []

  const sources = Array.from(validationSources ?? errorMap.keys()).sort(
    compareValidationSources,
  )
  return sources.flatMap(
    (validationSource) => errorMap.get(validationSource)?.errors ?? [],
  )
}

/**
 * Reconciles the fields currently receiving routed errors from one source.
 *
 * Current targets are written, stale targets are cleared, and both the next
 * target set and all affected fields are returned to the owner.
 */
export function reconcileRoutedFieldErrors(
  validationSource: AnyInternalValidationSourceInstance,
  fieldErrors: Iterable<readonly [AnyInternalFieldApi, Array<ValidationIssue>]>,
  oldFieldRefs: Set<AnyInternalFieldApi> | undefined,
  setFieldError: (
    field: AnyInternalFieldApi,
    validationSource: AnyInternalValidationSourceInstance,
    errors: Array<ValidationIssue>,
  ) => void,
  clearFieldError: (
    field: AnyInternalFieldApi,
    validationSource: AnyInternalValidationSourceInstance,
  ) => void,
): {
  fieldRefs: Set<AnyInternalFieldApi>
  affectedFields: Set<AnyInternalFieldApi>
  didFieldRefsChange: boolean
} {
  const staleFieldRefs = oldFieldRefs ? new Set(oldFieldRefs) : undefined
  const affectedFields = new Set<AnyInternalFieldApi>()
  const newFieldRefs = new Set<AnyInternalFieldApi>()

  for (const [field, fieldError] of fieldErrors) {
    setFieldError(field, validationSource, fieldError)
    newFieldRefs.add(field)
    affectedFields.add(field)
    staleFieldRefs?.delete(field)
  }

  if (staleFieldRefs) {
    for (const field of staleFieldRefs) {
      clearFieldError(field, validationSource)
      affectedFields.add(field)
    }
  }

  const didFieldRefsChange =
    newFieldRefs.size > 0 ||
    (oldFieldRefs !== undefined && oldFieldRefs.size > 0)

  return {
    fieldRefs: newFieldRefs,
    affectedFields,
    didFieldRefsChange,
  }
}
