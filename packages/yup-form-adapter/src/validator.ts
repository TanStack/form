import type { ValidationError as YupError, AnySchema } from 'yup'
import type { ValidationError, Validator } from '@tanstack/form-core'

export const yupValidator = () => {
  return {
    validate({ value }: { value: unknown }, fn: AnySchema): ValidationError {
      try {
        fn.validateSync(value)
        return
      } catch (_e) {
        const e = _e as YupError
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
        return e.errors.join(', ')
      }
    },
  }
}
