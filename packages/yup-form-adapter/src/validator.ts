import type { ValidationError as YupError, AnySchema } from 'yup'
import type { ValidationError, Validator } from '@tanstack/form-core'

export const yupValidator = (<Fn extends AnySchema = AnySchema>() => {
  return {
    validate(value: unknown, fn: Fn): ValidationError {
      try {
        fn.validateSync(value)
        return
      } catch (_e) {
        const e = _e as YupError
        return e.errors.join(', ')
      }
    },
    async validateAsync(value: unknown, fn: Fn): Promise<ValidationError> {
      try {
        await fn.validate(value)
        return
      } catch (_e) {
        const e = _e as YupError
        return e.errors.join(', ')
      }
    },
  }
}) satisfies Validator<unknown>
