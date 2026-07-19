import { getBy, isStandardSchema } from '@tanstack/form-core/internals'
import type {
  AnyInternalFieldApi,
  InternalFieldState,
} from '@tanstack/form-core/internals'
import type { ValidationIssue } from '@tanstack/form-core'
import type {
  DevtoolsFieldDetail,
  DevtoolsFieldError,
  DevtoolsFieldErrorSource,
  DevtoolsFieldValidatorType,
  FieldDetailSubscriptionDescriptor,
  FieldErrorPayloadMode,
} from '../../eventClientTypes'

function getValidatorType(
  validator: { run: unknown } | null | undefined,
): DevtoolsFieldValidatorType {
  return validator && isStandardSchema(validator.run as never)
    ? 'schema'
    : 'callback'
}

function projectError(
  error: ValidationIssue,
  mode: FieldErrorPayloadMode,
): { message: string } {
  if (mode === 'messages') {
    return { message: error.message }
  }

  return error
}

function appendErrors({
  destination,
  errorBuckets,
  errorSourceEvents,
  getSource,
  mode,
}: {
  destination: Array<DevtoolsFieldError>
  errorBuckets: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
  getSource: (
    validatorIndex: number,
    sourceEvent: string,
  ) => DevtoolsFieldErrorSource
  mode: FieldErrorPayloadMode
}): void {
  errorBuckets.forEach((errors, validatorIndex) => {
    if (errors.length === 0) return

    const sourceEvent = errorSourceEvents[validatorIndex] ?? 'unknown'
    const source = getSource(validatorIndex, sourceEvent)

    for (const error of errors) {
      destination.push({
        error: projectError(error, mode),
        source,
        sourceEvent,
      })
    }
  })
}

export function getDevtoolsFieldErrors(
  field: AnyInternalFieldApi,
  state: InternalFieldState,
  mode: FieldErrorPayloadMode,
): Array<DevtoolsFieldError> {
  // Keep this traversal aligned with getErrorsFromBaseMeta in form-core so
  // these entries have the same order as field.state.meta.original.errors.
  const errors: Array<DevtoolsFieldError> = []
  const meta = state.meta

  appendErrors({
    destination: errors,
    errorBuckets: meta._fieldValidatorErrors,
    errorSourceEvents: meta._fieldValidatorErrorSourceEvents,
    mode,
    getSource: (validatorIndex) => ({
      scope: 'field',
      validatorIndex,
      validatorType: getValidatorType(field._validators?.[validatorIndex]),
    }),
  })

  for (const [owner, groupErrors] of meta._formGroupValidatorErrors) {
    const group = Array.from(field.form._formGroups).find(
      (candidate) => candidate._errorOwner === owner,
    )

    appendErrors({
      destination: errors,
      errorBuckets: groupErrors.errors,
      errorSourceEvents: groupErrors.errorSourceEvents,
      mode,
      getSource: (validatorIndex) => ({
        scope: 'formGroup',
        formGroupPath: group ? String(group.name) : '(unknown form group)',
        validatorIndex,
        validatorType: getValidatorType(
          group?.options.validators?.[validatorIndex],
        ),
      }),
    })
  }

  const formValidators = field.form.options.validators ?? []
  appendErrors({
    destination: errors,
    errorBuckets: meta._formValidatorErrors,
    errorSourceEvents: meta._formValidatorErrorSourceEvents,
    mode,
    getSource: (validatorIndex, sourceEvent) => {
      if (
        validatorIndex === formValidators.length &&
        sourceEvent === 'submit'
      ) {
        return { scope: 'onSubmit', validatorType: 'callback' }
      }

      return {
        scope: 'form',
        validatorIndex,
        validatorType: getValidatorType(formValidators[validatorIndex]),
      }
    },
  })

  return errors
}

function getDevtoolsFieldState(
  field: AnyInternalFieldApi,
  state: InternalFieldState,
  descriptor: FieldDetailSubscriptionDescriptor,
): DevtoolsFieldDetail['state'] {
  const meta = state.meta
  const originalErrors = getDevtoolsFieldErrors(
    field,
    state,
    descriptor.settings.errorPayloadMode,
  )

  return {
    ...(descriptor.settings.includeValues ? { value: state.value } : {}),
    meta: {
      isTouched: meta.isTouched,
      isDirty: meta.isDirty,
      isPristine: meta.isPristine,
      isDefaultValue: meta.isDefaultValue,
      isBlurred: meta.isBlurred,
      isValidating: meta.isValidating,
      isSelfTouched: meta.isSelfTouched,
      isSelfDirty: meta.isSelfDirty,
      isSelfValidating: meta.isSelfValidating,
      isSelfValid: meta.isSelfValid,
      isValid: meta.isValid,
      isInvalid: meta.isInvalid,
      subfields: { ...meta.subfields },
      errors: meta.errors.length > 0 ? originalErrors : [],
      original: {
        errors: originalErrors,
        isValid: meta.original.isValid,
        isInvalid: meta.original.isInvalid,
      },
    },
  }
}

export function getDevtoolsFieldDetail(
  field: AnyInternalFieldApi,
  descriptor: FieldDetailSubscriptionDescriptor,
): DevtoolsFieldDetail {
  const state = field.atom.get()

  return {
    ...descriptor,
    state: getDevtoolsFieldState(field, state, descriptor),
    ...(descriptor.settings.includeValues
      ? { defaultValue: getBy(field.form.options.defaultValues, field.name) }
      : {}),
  }
}
