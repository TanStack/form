import { ValidationError } from '@tanstack/form-core'
import type { ZodError, ZodType, ZodTypeAny } from 'zod'

export type Validator<Type> = <Fn = unknown>() => {
  // If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
  validate(value: Type, fn: Fn): ValidationError
  validateAsync(value: Type, fn: Fn): Promise<ValidationError>
}

export const zodValidator = (<Fn = ZodType<any>>() => {
  return {
    validate(value: unknown, fn: Fn): ValidationError {
      // Call Zod on the value here and return the error message
      try {
        ;(fn as ZodTypeAny).parse(value)
        return
      } catch (_e) {
        const e = _e as ZodError<T>
        return e.toString()
      }
    },
    async validateAsync(value: unknown, fn: Fn): Promise<ValidationError> {
      // Call Zod on the value here and return the error message
      try {
        await (fn as ZodTypeAny).parseAsync(value)
        return
      } catch (_e) {
        const e = _e as ZodError<T>
        return e.toString()
      }
    },
  }
}) satisfies Validator<unknown>
