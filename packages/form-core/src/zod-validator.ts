import { ValidationError } from '@tanstack/form-core'
import type { ZodError, ZodType, ZodTypeAny } from 'zod'

export type Validator<PassedType, PassedFnType = unknown> = <
  InferedType extends PassedType = PassedType,
  Fn extends PassedFnType = PassedFnType,
>() => {
  // If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
  validate(value: InferedType, fn: Fn): ValidationError
  validateAsync(value: InferedType, fn: Fn): Promise<ValidationError>
}

export const zodValidator = (<T, Fn extends ZodType<T> = ZodType<T>>() => {
  return {
    validate(value: T, fn: Fn): ValidationError {
      // Call Zod on the value here and return the error message
      try {
        fn.parse(value)
        return
      } catch (_e) {
        const e = _e as ZodError<T>
        return e.toString()
      }
    },
    async validateAsync(value: T, fn: Fn): Promise<ValidationError> {
      // Call Zod on the value here and return the error message
      try {
        await fn.parseAsync(value)
        return
      } catch (_e) {
        const e = _e as ZodError<T>
        return e.toString()
      }
    },
  }
}) satisfies Validator<unknown, ZodType<any>>
