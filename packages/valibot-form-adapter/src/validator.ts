import { getDotPath, safeParse, safeParseAsync } from 'valibot'
import { setBy } from '@tanstack/form-core'
import type { Validator, ValidatorAdapterParams } from '@tanstack/form-core'
import type {
  BaseIssue,
  GenericIssue,
  GenericSchema,
  GenericSchemaAsync,
} from 'valibot'

type Params = ValidatorAdapterParams<GenericIssue>

export function prefixSchemaToErrors(errors: Array<BaseIssue<unknown>>) {
  let schema = {} as object
  for (const valibotError of errors) {
    schema = setBy(schema, getDotPath(valibotError), () => valibotError.message)
  }
  return schema
}

export function defaultFormTransformer(errors: Array<BaseIssue<unknown>>) {
  return {
    form: mapIssuesToSingleString(errors),
    fields: prefixSchemaToErrors(errors),
  }
}

export const mapIssuesToSingleString = (errors: Array<BaseIssue<unknown>>) =>
  errors.map((error) => error.message).join(', ')

export const valibotValidator =
  (
    params: Params = {},
  ): Validator<unknown, GenericSchema | GenericSchemaAsync> =>
  () => {
    return {
      validate({ value, validationSource }, fn) {
        if (fn.async) return
        const result = safeParse(fn, value, {
          abortPipeEarly: false,
        })
        if (result.success) return
        const transformErrors = params.transformErrors
          ? params.transformErrors
          : validationSource === 'form'
            ? defaultFormTransformer
            : mapIssuesToSingleString
        return transformErrors(result.issues)
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await safeParseAsync(fn, value, {
          abortPipeEarly: false,
        })
        if (result.success) return
        const transformErrors = params.transformErrors
          ? params.transformErrors
          : validationSource === 'form'
            ? defaultFormTransformer
            : mapIssuesToSingleString
        return transformErrors(result.issues)
      },
    }
  }
