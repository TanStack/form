import { setBy } from '@tanstack/form-core'
import type { Validator, ValidatorAdapterParams } from '@tanstack/form-core'
import type { ZodIssue, ZodType } from 'zod'

type Params = ValidatorAdapterParams<ZodIssue>

export function prefixSchemaToErrors(zodErrors: ZodIssue[]) {
  let schema = {} as object
  for (const zodError of zodErrors) {
    schema = setBy(schema, zodError.path, () => zodError.message)
  }
  return schema
}

export function defaultFormTransformer(zodErrors: ZodIssue[]) {
  return {
    form: mapIssuesToSingleString(zodErrors),
    fields: prefixSchemaToErrors(zodErrors),
  }
}

export const mapIssuesToSingleString = (issues: ZodIssue[]) =>
  issues.map((issue) => issue.message).join(', ')

export const zodValidator =
  (params: Params = {}): Validator<unknown, ZodType> =>
  () => {
    return {
      validate({ value, api }, fn) {
        const transformErrors =
          params.transformErrors ??
          (api === 'form' ? defaultFormTransformer : mapIssuesToSingleString)
        const result = fn.safeParse(value)
        if (result.success) return
        return transformErrors(result.error.issues)
      },
      async validateAsync({ value, api }, fn) {
        const transformErrors =
          params.transformErrors ??
          (api === 'form' ? defaultFormTransformer : mapIssuesToSingleString)

        const result = await fn.safeParseAsync(value)
        if (result.success) return
        return transformErrors(result.error.issues)
      },
    }
  }
