import { ValidatorInstance } from '@tanstack/form-core/internals'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { ValidationIssue } from '@tanstack/form-core'

export function setFieldValidatorErrors(
  field: AnyInternalFieldApi,
  errors: Array<ValidationIssue>,
  sourceEvent: Parameters<
    AnyInternalFieldApi['_processValidationResult']
  >[1] = 'change',
): void {
  field._validatorInstances ??= ValidatorInstance.update({
    definitions: [{ run: () => null, triggers: ['change'] }],
    instances: null,
    owner: field,
    scope: 'field',
  })
  const validatorInstance = field._validatorInstances![0]!

  field._processValidationResult(
    {
      instance: validatorInstance,
      value: { result: errors, output: null, hasOutput: false },
    },
    sourceEvent,
  )
}
