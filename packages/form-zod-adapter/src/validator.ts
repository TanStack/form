import type { ZodError, ZodType, ZodTypeAny } from 'zod'
import type { ValidationError, Validator } from "@tanstack/form-core";

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
