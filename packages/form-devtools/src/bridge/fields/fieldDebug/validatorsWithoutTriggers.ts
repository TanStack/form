import type { AnyFieldValidator } from '@tanstack/form-core/internals'
import type { ValidatorsWithoutTriggersSuspicion } from '../../../eventClientTypes'
import type { FieldDebugCase } from './types'
import type { FormGroupValidator, FormValidator } from '@tanstack/form-core'

type ValidatorLocation =
  ValidatorsWithoutTriggersSuspicion['evidence']['validators'][number]

function appendValidatorsWithoutTriggers(
  locations: Array<ValidatorLocation>,
  validators: ReadonlyArray<
    AnyFieldValidator | FormGroupValidator<any> | FormValidator<any>
  > | null,
  getLocation: (validatorIndex: number) => ValidatorLocation,
): void {
  validators?.forEach((validator, validatorIndex) => {
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
      field._validators,
      (validatorIndex) => ({ scope: 'field', validatorIndex }),
    )

    const group = field._getFormGroup()
    if (group) {
      appendValidatorsWithoutTriggers(
        validators,
        group._options.validators ?? null,
        (validatorIndex) => ({
          scope: 'formGroup',
          formGroupPath: String(group.name),
          validatorIndex,
        }),
      )
    } else {
      appendValidatorsWithoutTriggers(
        validators,
        field.form._options.validators ?? null,
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
