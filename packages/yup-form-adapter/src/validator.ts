import {
  type Validator,
  type ValidatorAdapterParams,
  setBy,
} from '@tanstack/form-core'
import type { AnySchema, ValidationError as YupError } from 'yup'

type Params = ValidatorAdapterParams<string>

export function prefixSchemaToErrors(error: YupError) {
  let schema = {} as object
  for (const yupError of error.inner) {
    schema = setBy(schema, yupError.path, () => yupError.message)
  }
  return schema
}

export function defaultFormTransformer(error: YupError) {
  return {
    form: mapIssuesToSingleString(error),
    fields: prefixSchemaToErrors(error),
  }
}

export const mapIssuesToSingleString = (error: YupError) =>
  error.errors.join(', ')

const executeParamsTransformErrors =
  (transformErrors: NonNullable<Params['transformErrors']>) =>
  (e: YupError) => {
    return transformErrors(e.errors)
  }

export const yupValidator =
  (params: Params = {}): Validator<unknown, AnySchema> =>
  () => {
    return {
      validate({ value, validationSource }, fn) {
        try {
          fn.validateSync(value, { abortEarly: false })
          return
        } catch (_e) {
          const e = _e as YupError
          const transformErrors = params.transformErrors
            ? executeParamsTransformErrors(params.transformErrors)
            : validationSource === 'form'
              ? defaultFormTransformer
              : mapIssuesToSingleString

          return transformErrors(e)
        }
      },
      async validateAsync({ value, validationSource }, fn) {
        try {
          await fn.validate(value)
          return
        } catch (_e) {
          const e = _e as YupError
          const transformErrors = params.transformErrors
            ? executeParamsTransformErrors(params.transformErrors)
            : validationSource === 'form'
              ? defaultFormTransformer
              : mapIssuesToSingleString

          return transformErrors(e)
        }
      },
    }
  }
