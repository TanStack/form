import type { AnyInternalValidatorInstance } from '@tanstack/form-core/internals'
import type { ValidatorsWithoutTriggersSuspicion } from '../../../eventClientTypes'
import type { FieldDebugCase } from './types'

type ValidatorLocation =
  ValidatorsWithoutTriggersSuspicion['evidence']['validators'][number]

function appendValidatorsWithoutTriggers(
  locations: Array<ValidatorLocation>,
  validatorInstances: ReadonlyArray<AnyInternalValidatorInstance> | null,
  getLocation: (validatorIndex: number) => ValidatorLocation,
): void {
  validatorInstances?.forEach(({ definition: validator }, validatorIndex) => {
    if (validator.triggers.length === 0 && !validator.runOnMount) {
      locations.push(getLocation(validatorIndex))
    }
  })
}

export const validatorsWithoutTriggers = {
  evaluate: ({ field }) => {
    const validators: Array<ValidatorLocation> = []

    appendValidatorsWithoutTriggers(
      validators,
      field._validatorInstances,
      (validatorIndex) => ({ scope: 'field', validatorIndex }),
    )

    const group = field._getFormGroup()
    if (group) {
      appendValidatorsWithoutTriggers(
        validators,
        group._validatorInstances,
        (validatorIndex) => ({
          scope: 'formGroup',
          formGroupPath: String(group.name),
          validatorIndex,
        }),
      )
    } else {
      appendValidatorsWithoutTriggers(
        validators,
        field.form._validatorInstances,
        (validatorIndex) => ({ scope: 'form', validatorIndex }),
      )
    }

    if (validators.length === 0) return undefined

    return {
      kind: 'validators-without-triggers',
      evidence: {
        fieldPath: field.name,
        validators,
      },
    }
  },
} satisfies FieldDebugCase
