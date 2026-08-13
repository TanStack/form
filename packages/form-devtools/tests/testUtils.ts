import { reconcileValidatorInstances } from '@tanstack/form-core/internals'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { ValidationIssue } from '@tanstack/form-core'

export function setFieldValidatorErrors(
  field: AnyInternalFieldApi,
  errors: Array<ValidationIssue>,
  sourceEvent = 'change',
): void {
  field._validatorInstances ??= reconcileValidatorInstances({
    definitions: [{ run: () => null, triggers: ['change'] }],
    instances: null,
    owner: field,
    scope: 'field',
  })
  const validatorInstance = field._validatorInstances![0]!

  field._setMeta((meta) => ({
    ...meta,
    _validationSourceErrors:
      errors.length > 0
        ? new Map([[validatorInstance, { errors, sourceEvent }]])
        : null,
  }))
}
