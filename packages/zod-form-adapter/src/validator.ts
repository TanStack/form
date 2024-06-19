import type { ValidationError } from '@tanstack/form-core'
import type { SafeParseError, ZodIssue, ZodType, ZodTypeAny } from 'zod'

type Params = {
  transformErrors?: (errors: ZodIssue[]) => ValidationError
}

export const zodValidator =
  (params: Params = {}) =>
  () => {
    return {
      validate({ value }: { value: unknown }, fn: ZodType): ValidationError {
        // Call Zod on the value here and return the error message
        const result = (fn as ZodTypeAny).safeParse(value)
        if (!result.success) {
          if (params.transformErrors) {
            return params.transformErrors(
              (result as SafeParseError<any>).error.issues,
            )
          }
          return (result as SafeParseError<any>).error.issues
            .map((issue) => issue.message)
            .join(', ')
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
          if (params.transformErrors) {
            return params.transformErrors(
              (result as SafeParseError<any>).error.issues,
            )
          }
          return (result as SafeParseError<any>).error.issues
            .map((issue) => issue.message)
            .join(', ')
        }
        return
      },
    }
  }
