import type { ZodError, ZodType, ZodTypeAny } from 'zod'
import type { ValidationError } from './FormApi'

// If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
export type Validator<Type, Fn = unknown> = () => {
  validate(value: Type, fn: Fn): ValidationError
  validateAsync(value: Type, fn: Fn): Promise<ValidationError>
}

export const zodValidator = (<Fn extends ZodType<any> = ZodType<any>>() => {
  return {
    validate(value: unknown, fn: Fn): ValidationError {
      // Call Zod on the value here and return the error message
      try {
        ;(fn as ZodTypeAny).parse(value)
        return
      } catch (_e) {
        const e = _e as ZodError
        return e.toString()
      }
    },
    async validateAsync(value: unknown, fn: Fn): Promise<ValidationError> {
      // Call Zod on the value here and return the error message
      try {
        await (fn as ZodTypeAny).parseAsync(value)
        return
      } catch (_e) {
        const e = _e as ZodError
        return e.toString()
      }
    },
  }
}) satisfies Validator<unknown>