import { safeParse, safeParseAsync } from 'valibot'
import type { BaseIssue, BaseSchema, BaseSchemaAsync } from 'valibot'
import type { Validator } from '@tanstack/form-core'

type Params = {
  errorMap?: (
    errors: [BaseIssue<unknown>, ...BaseIssue<unknown>[]],
  ) => BaseIssue<unknown>
}

export const valibotValidator = (params: Params = {}) =>
  (() => {
    return {
      validate({ value }, fn) {
        if (fn.async) return
        const result = safeParse(fn, value)
        if (result.success) return
        if (params.errorMap) {
          return params.errorMap(result.issues)
        }
        return result.issues.map((i) => i.message).join(', ')
      },
      async validateAsync({ value }, fn) {
        const result = await safeParseAsync(fn, value)
        if (result.success) return
        if (params.errorMap) {
          return params.errorMap(result.issues)
        }
        return result.issues.map((i) => i.message).join(', ')
      },
    }
  }) as Validator<
    unknown,
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
