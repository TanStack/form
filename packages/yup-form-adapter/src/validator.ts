import type { AnySchema, ValidationError as YupError } from 'yup'
import type { ValidationError } from '@tanstack/form-core'

type Params = {
  transformErrors?: (errors: string[]) => ValidationError
}

export const yupValidator =
  (params: Params = {}) =>
  () => {
    return {
      validate({ value }: { value: unknown }, fn: AnySchema): ValidationError {
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
      async validateAsync(
        { value }: { value: unknown },
        fn: AnySchema,
      ): Promise<ValidationError> {
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
