import type { ZodType, ZodTypeAny } from 'zod'
import type { ValidationError, Validator } from '@tanstack/form-core'

export const zodValidator = (<Fn extends ZodType = ZodType>() => {
  return {
    validate({ value }: { value: unknown }, fn: Fn): ValidationError {
      // Call Zod on the value here and return the error message
      const result = (fn as ZodTypeAny).safeParse(value)
      if (!result.success) {
        return result.error.issues.map((issue) => issue.message).join(', ')
      }
      return
    },
    async validateAsync(
      { value }: { value: unknown },
      fn: Fn,
    ): Promise<ValidationError> {
      // Call Zod on the value here and return the error message
      const result = await (fn as ZodTypeAny).safeParseAsync(value)
      if (!result.success) {
        return result.error.issues.map((issue) => issue.message).join(', ')
      }
      return
    },
  }
}) satisfies Validator<unknown>
