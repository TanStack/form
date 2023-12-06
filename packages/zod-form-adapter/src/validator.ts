import type { ZodType, ZodTypeAny } from 'zod'
import type { ValidationError, Validator } from '@tanstack/form-core'

export const zodValidator = (() => {
  return {
    validate({ value }: { value: unknown }, fn: ZodType): ValidationError {
      // Call Zod on the value here and return the error message
      const result = (fn as ZodTypeAny).safeParse(value)
      if (!result.success) {
        return result.error.issues.map((issue) => issue.message).join(', ')
      }
      return
    },
    async validateAsync(
      { value }: { value: unknown },
      fn: ZodType,
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
