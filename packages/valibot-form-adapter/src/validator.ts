import { safeParse, safeParseAsync } from 'valibot'
import type { BaseIssue, BaseSchema, BaseSchemaAsync } from 'valibot'
import type { Validator, ValidationError } from '@tanstack/form-core'

type Params = {
  transformErrors?: (errors: BaseIssue<unknown>[]) => ValidationError
}

export const valibotValidator = (params: Params = {}) =>
  (() => {
    return {
      validate({ value }, fn) {
        if (fn.async) return
        const result = safeParse(fn, value)
        if (result.success) return
        if (params.transformErrors) {
          return params.transformErrors(result.issues)
        }
        return result.issues.map((i) => i.message).join(', ')
      },
      async validateAsync({ value }, fn) {
        const result = await safeParseAsync(fn, value)
        if (result.success) return
        if (params.transformErrors) {
          return params.transformErrors(result.issues)
        }
        return result.issues.map((i) => i.message).join(', ')
      },
    }
  }) as Validator<
    unknown,
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
