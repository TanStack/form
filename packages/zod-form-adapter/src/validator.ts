import type { Validator, ValidatorAdapterParams } from '@tanstack/form-core'
import type { ZodIssue, ZodType } from 'zod'

type Params = ValidatorAdapterParams<ZodIssue>

export const zodValidator =
  (params: Params = {}): Validator<unknown, ZodType> =>
  () => {
    return {
      validate({ value }, fn) {
        const result = fn.safeParse(value)
        if (result.success) return
        if (params.transformErrors) {
          return params.transformErrors(result.error.issues)
        }
        return result.error.issues.map((issue) => issue.message).join(', ')
      },
      async validateAsync({ value }, fn) {
        const result = await fn.safeParseAsync(value)
        if (result.success) return
        if (params.transformErrors) {
          return params.transformErrors(result.error.issues)
        }
        return result.error.issues.map((issue) => issue.message).join(', ')
      },
    }
  }
