import {
  type GenericIssue,
  type GenericSchema,
  type GenericSchemaAsync,
  safeParse,
  safeParseAsync,
} from 'valibot'
import type { Validator, ValidatorAdapterParams } from '@tanstack/form-core'

type Params = ValidatorAdapterParams<GenericIssue>

export const valibotValidator =
  (
    params: Params = {},
  ): Validator<unknown, GenericSchema | GenericSchemaAsync> =>
  () => {
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
  }
