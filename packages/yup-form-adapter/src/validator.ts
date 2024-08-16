import type { Validator, ValidatorAdapterParams } from '@tanstack/form-core'
import type { AnySchema, ValidationError as YupError } from 'yup'

type Params = ValidatorAdapterParams<string>

export const yupValidator =
  (params: Params = {}): Validator<unknown, AnySchema> =>
  () => {
    return {
      validate({ value }, fn) {
        try {
          fn.validateSync(value)
          return
        } catch (_e) {
          const e = _e as YupError
          if (params.transformErrors) {
            return params.transformErrors(e.errors)
          }
          return e.errors.join(', ')
        }
      },
      async validateAsync({ value }, fn) {
        try {
          await fn.validate(value)
          return
        } catch (_e) {
          const e = _e as YupError
          if (params.transformErrors) {
            return params.transformErrors(e.errors)
          }
          return e.errors.join(', ')
        }
      },
    }
  }
